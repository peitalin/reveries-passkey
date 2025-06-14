import type { AuthenticatorTransport } from '@simplewebauthn/types';

/**
 * Represents a user in the system.
 */
export interface User {
  id: string; // Unique identifier for the user (e.g., a UUID or derived from first passkey rawId)
  username: string;
  nearAccountId?: string;
  currentChallenge?: string;
  currentCommitmentId?: string;
}

/**
 * Represents an authenticator registered by a user, structured for storage
 * and for use with @simplewebauthn/server verification functions.
 */
export interface StoredAuthenticator {
  credentialID: string; // Stored as Base64URL string from the original Uint8Array
  credentialPublicKey: Uint8Array; // Stored as Uint8Array (or convert from PEM/other format if necessary)
  counter: number;
  transports?: AuthenticatorTransport[];

  // Application-specific fields:
  userId: string; // Link back to the user this authenticator belongs to
  name?: string; // A user-friendly name for the authenticator
  registered: Date;
  lastUsed?: Date;
  // BackedUp is an important property for passkeys to indicate if they are synced across devices.
  // simplewebauthn's verifyRegistrationResponse can provide this as `credentialBackedUp`.
  backedUp: boolean;
  clientNearPublicKey?: string; // Client-generated NEAR public key for Option 1, ed25519 string
}

// Types for PasskeyController Smart Contract interaction

export enum ActionType {
  CreateAccount = "CreateAccount",
  DeployContract = "DeployContract",
  FunctionCall = "FunctionCall",
  Transfer = "Transfer",
  Stake = "Stake",
  AddKey = "AddKey",
  DeleteKey = "DeleteKey",
  DeleteAccount = "DeleteAccount",
  DiscoverableLogin = "DiscoverableLogin"
}

// Interface for the arguments expected by the contract's execute_delegated_actions method
export interface SerializableActionArgs {
  action_type: ActionType;
  receiver_id?: string;
  method_name?: string;
  args?: string; // Base64 encoded string of JSON args
  deposit?: string; // yoctoNEAR as string (e.g., "1000000000000000000000000")
  gas?: string; // Gas as string (e.g., "30000000000000")
  amount?: string; // yoctoNEAR as string, for Transfer
  public_key?: string; // For AddKey, DeleteKey, Stake
  allowance?: string; // yoctoNEAR as string, for AddKey (FunctionCallAccessKey)
  method_names?: string[]; // For AddKey (FunctionCallAccessKey)
  code?: string; // Base64 encoded string of contract code, for DeployContract
  stake?: string; // yoctoNEAR as string, for Stake
  beneficiary_id?: string; // For DeleteAccount
  // Fields for CreateAccount action (if part of SerializableActionArgs)
  new_account_id?: string; // For CreateAccount if receiver_id is ambiguous
  new_account_public_key?: string; // For CreateAccount
  new_account_deposit?: string; // For CreateAccount initial deposit
}

// For action challenge store
export interface StoredActionChallengeData {
    actionDetails: SerializableActionArgs;
    expectedCredentialID?: string; // Optional: if challenge is tied to a specific passkey
    // any other relevant data to verify against during execute-delegate-action
}

// Result type for NearClient.createAccount method
export interface CreateAccountResult {
  success: boolean;
  message: string;
  result?: { // Present on success
    accountId: string;
    publicKey: string;
    // transactionOutcome?: any; // Optionally include full transaction outcome if needed
  };
  error?: any; // Present on failure, can be an Error object or other structured error info
  details?: string; // Additional details for errors, similar to how it's used in API responses
}

// === ENDPOINT TYPES ===
// Re-export all endpoint types for convenience
export * from './types/endpoints';