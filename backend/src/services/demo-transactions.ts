import { Blockchain } from '@prisma/client';

export function generateDemoTransactions(address: string, blockchain: Blockchain) {
  const now = Date.now();
  
  return [
    {
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      fromAddress: address,
      toAddress: '0x' + '1'.repeat(40),
      amount: 0.5,
      timestamp: new Date(now - 3600000),
      blockchain
    },
    {
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      fromAddress: '0x' + '2'.repeat(40),
      toAddress: address,
      amount: 1.2,
      timestamp: new Date(now - 7200000),
      blockchain
    },
    {
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      fromAddress: address,
      toAddress: '0x' + '3'.repeat(40),
      amount: 0.8,
      timestamp: new Date(now - 10800000),
      blockchain
    }
  ];
}
