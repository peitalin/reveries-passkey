import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  port: number | string;
  expectedOrigin: string;
  relayerAccountId: string;
  relayerPrivateKey: string;
  nearRpcUrl: string;
  networkId: string;
}

const config: AppConfig = {
  port: process.env.PORT || 3001,
  expectedOrigin: process.env.EXPECTED_ORIGIN || 'https://example.localhost',
  relayerAccountId: process.env.RELAYER_ACCOUNT_ID || 'relayer.testnet',
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY || 'ed25519:examplePrivateKey...',
  nearRpcUrl: process.env.NEAR_RPC_URL || 'https://rpc.testnet.near.org',
  networkId: process.env.NEAR_NETWORK_ID || 'testnet',
};

export default config;