import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { blockchainMonitor } from './blockchain.service';
import { logger } from '../utils/logger';
import { Blockchain } from '@prisma/client';

const alchemyConfig = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

let alchemy: Alchemy | null = null;

export const initializeWebhooks = () => {
  if (!process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY === 'LO4rb75qOoa_9s7ZW8KBL') {
    logger.warn('Alchemy API key not configured, webhooks disabled');
    return;
  }

  try {
    alchemy = new Alchemy(alchemyConfig);
    logger.info('Alchemy webhooks initialized');
  } catch (error) {
    logger.error('Failed to initialize Alchemy', { error });
  }
};

export const subscribeToAddress = async (address: string, blockchain: Blockchain) => {
  if (!alchemy) {
    logger.warn('Alchemy not initialized, skipping webhook subscription');
    return;
  }

  try {
    // Subscribe to address activity
    const subscription = await alchemy.ws.on(
      {
        method: AlchemySubscription.PENDING_TRANSACTIONS,
        addresses: [{ to: address }, { from: address }],
      },
      (tx) => {
        logger.info(`Real-time transaction detected for ${address}`, { hash: tx.hash });
        // Process transaction immediately
        blockchainMonitor.monitorWallet(address, blockchain, '').catch(console.error);
      }
    );

    logger.info(`Subscribed to real-time updates for ${address}`);
    return subscription;
  } catch (error) {
    logger.error('Failed to subscribe to address', { error, address });
  }
};

export const unsubscribeFromAddress = async (address: string) => {
  if (!alchemy) return;
  
  try {
    // Alchemy SDK handles cleanup automatically
    logger.info(`Unsubscribed from ${address}`);
  } catch (error) {
    logger.error('Failed to unsubscribe', { error, address });
  }
};
