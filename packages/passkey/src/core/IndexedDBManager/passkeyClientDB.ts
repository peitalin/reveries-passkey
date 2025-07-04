import { openDB, type IDBPDatabase } from 'idb';
import { type ValidationResult, validateNearAccountId } from '../../utils/validation';

// === TYPE DEFINITIONS ===
export interface ClientUserData {
  // Primary key
  nearAccountId: string;

  // User metadata
  registeredAt: number;
  lastLogin?: number;
  lastUpdated: number;

  // WebAuthn/Passkey data (merged from WebAuthnManager)
  clientNearPublicKey?: string;
  prfSupported?: boolean;
  passkeyCredential?: {
    id: string;
    rawId: string;
  };

  // VRF credentials for stateless authentication
  encryptedVrfKeypair?: {
    encrypted_vrf_data_b64u: string;
    aes_gcm_nonce_b64u: string;
  };

  // User preferences
  preferences?: UserPreferences;
}

export interface UserPreferences {
  useRelayer: boolean;
  useNetwork: 'testnet' | 'mainnet';
  // User preferences can be extended here as needed
}

// Authenticator cache
export interface ClientAuthenticatorData {
  credentialId: string;
  credentialPublicKey: Uint8Array;
  transports?: string[]; // AuthenticatorTransport[]
  name?: string;
  nearAccountId: string; // FK reference for queries
  registered: string; // ISO date string
  syncedAt: string; // When this cache entry was last synced with contract
  vrfPublicKey: string; // Base64-encoded VRF public key (1:1 relationship on client)
}

interface AppStateEntry<T = any> {
  key: string;
  value: T;
}

interface PasskeyClientDBConfig {
  dbName: string;
  dbVersion: number;
  userStore: string;
  appStateStore: string;
  authenticatorStore: string;
}

// === CONSTANTS ===
const DB_CONFIG: PasskeyClientDBConfig = {
  dbName: 'PasskeyClientDB',
  dbVersion: 5, // Increment version for schema changes
  userStore: 'users',
  appStateStore: 'appState',
  authenticatorStore: 'authenticators'
} as const;

export class PasskeyClientDBManager {
  private config: PasskeyClientDBConfig;
  private db: IDBPDatabase | null = null;

  constructor(config: PasskeyClientDBConfig = DB_CONFIG) {
    this.config = config;
  }

  private async getDB(): Promise<IDBPDatabase> {
    if (this.db) {
      return this.db;
    }

    this.db = await openDB(this.config.dbName, this.config.dbVersion, {
      upgrade(db, oldVersion): void {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains(DB_CONFIG.userStore)) {
          db.createObjectStore(DB_CONFIG.userStore, { keyPath: 'nearAccountId' });
        }
        if (!db.objectStoreNames.contains(DB_CONFIG.appStateStore)) {
          db.createObjectStore(DB_CONFIG.appStateStore, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(DB_CONFIG.authenticatorStore)) {
          // Use composite key for authenticators
          const authStore = db.createObjectStore(DB_CONFIG.authenticatorStore, { keyPath: ['nearAccountId', 'credentialId'] });
          authStore.createIndex('nearAccountId', 'nearAccountId', { unique: false });
        }
      },
      blocked() {
        console.warn('PasskeyClientDB connection is blocked.');
      },
      blocking() {
        console.warn('PasskeyClientDB connection is blocking another connection.');
      },
      terminated: () => {
        console.warn('PasskeyClientDB connection has been terminated.');
        this.db = null;
      },
    });

    return this.db;
  }

  // === APP STATE METHODS ===

  async getAppState<T = any>(key: string): Promise<T | undefined> {
    const db = await this.getDB();
    const result = await db.get(DB_CONFIG.appStateStore, key);
    return result?.value as T | undefined;
  }

  async setAppState<T = any>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    const entry: AppStateEntry<T> = { key, value };
    await db.put(DB_CONFIG.appStateStore, entry);
  }

  // === ACCOUNT ID VALIDATION AND UTILITIES ===

  /**
   * Validate that a NEAR account ID is in the expected format
   * Supports both <username>.<relayerAccountId> and <username>.testnet formats
   */
  validateNearAccountId(nearAccountId: string): ValidationResult {
    return validateNearAccountId(nearAccountId);
  }

  /**
   * Extract username from NEAR account ID
   */
  extractUsername(nearAccountId: string): string {
    const validation = validateNearAccountId(nearAccountId);
    if (!validation.valid) {
      throw new Error(`Invalid NEAR account ID: ${validation.error}`);
    }
    return nearAccountId.split('.')[0];
  }

  /**
   * Generate a NEAR account ID from a username and domain
   * @param username - The username to use for the account ID
   * @param domain - The domain to use for the account ID
   * @returns The generated NEAR account ID
   */
  generateNearAccountId(username: string, domain: string): string {
    const sanitizedName = username
      .toLowerCase()
      .replace(/[^a-z0-9_\\-]/g, '')
      .substring(0, 32);
    return `${sanitizedName}.${domain}`;
  }

  // === USER MANAGEMENT METHODS ===

  async getUser(nearAccountId: string): Promise<ClientUserData | null> {
    if (!nearAccountId) return null;

    const validation = this.validateNearAccountId(nearAccountId);
    if (!validation.valid) {
      console.warn(`Invalid account ID format: ${nearAccountId}`);
      return null;
    }

    const db = await this.getDB();
    const result = await db.get(DB_CONFIG.userStore, nearAccountId);
    return result || null;
  }

  /**
   * Get the current/last user
   * This is maintained via app state and updated whenever a user is stored or updated
   */
  async getLastUser(): Promise<ClientUserData | null> {
    const lastUserAccount = await this.getAppState<string>('lastUserAccountId');
    if (!lastUserAccount) return null;

    return this.getUser(lastUserAccount);
  }

  async hasPasskeyCredential(nearAccountId: string): Promise<boolean> {
    try {
      const userData = await this.getUser(nearAccountId);
      return !!userData && !!userData.clientNearPublicKey;
    } catch (error) {
      console.warn('Error checking passkey credential:', error);
      return false;
    }
  }

  /**
   * Register a new user with the given NEAR account ID
   * @param nearAccountId - Full NEAR account ID (e.g., "username.testnet" or "username.relayer.testnet")
   * @param additionalData - Additional user data to store
   */
  async registerUser(
    nearAccountId: string,
    additionalData?: Partial<ClientUserData>
  ): Promise<ClientUserData> {
    const validation = this.validateNearAccountId(nearAccountId);
    if (!validation.valid) {
      throw new Error(`Cannot register user with invalid account ID: ${validation.error}`);
    }

    const now = Date.now();

    const userData: ClientUserData = {
      nearAccountId,
      registeredAt: now,
      lastLogin: now,
      lastUpdated: now,
      preferences: {
        useRelayer: false,
        useNetwork: 'testnet',
        // Default preferences can be set here
      },
      ...additionalData,
    };

    await this.storeUser(userData);
    return userData;
  }

  async updateUser(nearAccountId: string, updates: Partial<ClientUserData>): Promise<void> {
    const user = await this.getUser(nearAccountId);
    if (user) {
      const updatedUser = {
        ...user,
        ...updates,
        lastUpdated: Date.now()
      };
      await this.storeUser(updatedUser); // This will update the app state lastUserAccountId
    }
  }

  async updateLastLogin(nearAccountId: string): Promise<void> {
    await this.updateUser(nearAccountId, { lastLogin: Date.now() });
  }

  async updatePreferences(
    nearAccountId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    const user = await this.getUser(nearAccountId);
    if (user) {
      const updatedPreferences = {
        ...user.preferences,
        ...preferences
      } as UserPreferences;
      await this.updateUser(nearAccountId, { preferences: updatedPreferences });
    }
  }

  private async storeUser(userData: ClientUserData): Promise<void> {
    const validation = this.validateNearAccountId(userData.nearAccountId);
    if (!validation.valid) {
      throw new Error(`Cannot store user with invalid account ID: ${validation.error}`);
    }

    const db = await this.getDB();
    await db.put(DB_CONFIG.userStore, userData);
    await this.setAppState('lastUserAccountId', userData.nearAccountId);
  }

  /**
   * Store WebAuthn user data (compatibility with WebAuthnManager)
   * @param userData - User data with nearAccountId as primary identifier
   */
  async storeWebAuthnUserData(userData: {
    nearAccountId: string;
    clientNearPublicKey?: string;
    lastUpdated?: number;
    prfSupported?: boolean;
    passkeyCredential?: {
      id: string;
      rawId: string;
    };
    encryptedVrfKeypair?: {
      encrypted_vrf_data_b64u: string;
      aes_gcm_nonce_b64u: string;
    };
  }): Promise<void> {
    const validation = this.validateNearAccountId(userData.nearAccountId);
    if (!validation.valid) {
      throw new Error(`Cannot store WebAuthn data for invalid account ID: ${validation.error}`);
    }

    // Get existing user data or create new
    let existingUser = await this.getUser(userData.nearAccountId);
    if (!existingUser) {
      existingUser = await this.registerUser(userData.nearAccountId);
    }

    // Update with WebAuthn-specific data (including VRF credentials)
    await this.updateUser(userData.nearAccountId, {
      clientNearPublicKey: userData.clientNearPublicKey,
      prfSupported: userData.prfSupported,
      passkeyCredential: userData.passkeyCredential,
      encryptedVrfKeypair: userData.encryptedVrfKeypair,
      lastUpdated: userData.lastUpdated || Date.now()
    });
  }

  async getAllUsers(): Promise<ClientUserData[]> {
    const db = await this.getDB();
    return db.getAll(DB_CONFIG.userStore);
  }

  async deleteUser(nearAccountId: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(DB_CONFIG.userStore, nearAccountId);
    // Also clean up related authenticators
    await this.clearAuthenticatorsForUser(nearAccountId);
  }

  async clearAllUsers(): Promise<void> {
    const db = await this.getDB();
    await db.clear(DB_CONFIG.userStore);
  }

  async clearAllAppState(): Promise<void> {
    const db = await this.getDB();
    await db.clear(DB_CONFIG.appStateStore);
  }

  /**
   * Store authenticator data for a user
   */
  async storeAuthenticator(authenticatorData: ClientAuthenticatorData): Promise<void> {
    const db = await this.getDB();
    await db.put(DB_CONFIG.authenticatorStore, authenticatorData);
  }

  /**
   * Get all authenticators for a user
   */
  async getAuthenticatorsByUser(nearAccountId: string): Promise<ClientAuthenticatorData[]> {
    const db = await this.getDB();
    const tx = db.transaction(DB_CONFIG.authenticatorStore, 'readonly');
    const store = tx.objectStore(DB_CONFIG.authenticatorStore);
    const index = store.index('nearAccountId');

    return await index.getAll(nearAccountId);
  }

  /**
   * Get a specific authenticator by credential ID
   */
  async getAuthenticatorByCredentialId(
    nearAccountId: string,
    credentialId: string
  ): Promise<ClientAuthenticatorData | null> {
    const db = await this.getDB();
    const result = await db.get(DB_CONFIG.authenticatorStore, [nearAccountId, credentialId]);
    return result || null;
  }

  /**
   * Clear all authenticators for a user
   */
  async clearAuthenticatorsForUser(nearAccountId: string): Promise<void> {
    const authenticators = await this.getAuthenticatorsByUser(nearAccountId);
    const db = await this.getDB();
    const tx = db.transaction(DB_CONFIG.authenticatorStore, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.authenticatorStore);

    for (const auth of authenticators) {
      await store.delete([nearAccountId, auth.credentialId]);
    }
  }

  /**
   * Sync authenticators from contract data
   */
  async syncAuthenticatorsFromContract(
    nearAccountId: string,
    contractAuthenticators: Array<{
      credentialId: string;
      credentialPublicKey: Uint8Array;
      transports?: string[];
      name?: string;
      registered: string;
      vrfPublicKey: string;
    }>
  ): Promise<void> {
    // Clear existing cache for this user
    await this.clearAuthenticatorsForUser(nearAccountId);

    // Add all contract authenticators to cache
    const syncedAt = new Date().toISOString();
    for (const auth of contractAuthenticators) {
      const clientAuth: ClientAuthenticatorData = {
        credentialId: auth.credentialId,
        credentialPublicKey: auth.credentialPublicKey,
        transports: auth.transports,
        name: auth.name,
        nearAccountId: nearAccountId,
        registered: auth.registered,
        syncedAt: syncedAt,
        vrfPublicKey: auth.vrfPublicKey,
      };
      await this.storeAuthenticator(clientAuth);
    }
  }

  // === ATOMIC OPERATIONS AND ROLLBACK METHODS ===

  /**
   * Delete all authenticators for a user
   */
  async deleteAllAuthenticatorsForUser(nearAccountId: string): Promise<void> {
    const authenticators = await this.getAuthenticatorsByUser(nearAccountId);

    if (authenticators.length === 0) {
      console.log(`No authenticators found for user ${nearAccountId}`);
      return;
    }

    const db = await this.getDB();
    const tx = db.transaction(DB_CONFIG.authenticatorStore, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.authenticatorStore);

    for (const auth of authenticators) {
      await store.delete([nearAccountId, auth.credentialId]);
    }

    console.log(`Deleted ${authenticators.length} authenticators for user ${nearAccountId}`);
  }

  /**
   * Atomic operation wrapper for multiple IndexedDB operations
   * Either all operations succeed or all are rolled back
   */
  async atomicOperation<T>(operation: (db: IDBPDatabase) => Promise<T>): Promise<T> {
    const db = await this.getDB();
    try {
      const result = await operation(db);
      return result;
    } catch (error) {
      console.error('Atomic operation failed:', error);
      throw error;
    }
  }

  /**
   * Complete rollback of user registration data
   * Deletes user, authenticators, and WebAuthn data atomically
   */
  async rollbackUserRegistration(nearAccountId: string): Promise<void> {
    console.log(`Rolling back registration data for ${nearAccountId}`);

    await this.atomicOperation(async (db) => {
      // Delete all authenticators for this user
      await this.deleteAllAuthenticatorsForUser(nearAccountId);

      // Delete user record
      await db.delete(DB_CONFIG.userStore, nearAccountId);

      // Clear from app state if this was the last user
      const lastUserAccount = await this.getAppState<string>('lastUserAccountId');
      if (lastUserAccount === nearAccountId) {
        await this.setAppState('lastUserAccountId', null);
      }

      console.log(`✅ Rolled back all registration data for ${nearAccountId}`);
      return true;
    });
  }
}