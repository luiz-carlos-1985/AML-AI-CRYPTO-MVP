export interface BlockchainInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  category: 'Layer1' | 'Layer2' | 'Sidechain';
  explorer: string;
  description: string;
}

export const BLOCKCHAINS: BlockchainInfo[] = [
  // Layer 1 - Major
  { id: 'BITCOIN', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: '#F7931A', category: 'Layer1', explorer: 'blockchain.com', description: 'Original cryptocurrency' },
  { id: 'ETHEREUM', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: '#627EEA', category: 'Layer1', explorer: 'etherscan.io', description: 'Smart contract platform' },
  { id: 'SOLANA', name: 'Solana', symbol: 'SOL', icon: '◎', color: '#14F195', category: 'Layer1', explorer: 'solscan.io', description: 'High-performance blockchain' },
  { id: 'CARDANO', name: 'Cardano', symbol: 'ADA', icon: '₳', color: '#0033AD', category: 'Layer1', explorer: 'cardanoscan.io', description: 'Proof-of-stake blockchain' },
  { id: 'POLKADOT', name: 'Polkadot', symbol: 'DOT', icon: '●', color: '#E6007A', category: 'Layer1', explorer: 'polkascan.io', description: 'Multi-chain protocol' },
  { id: 'AVALANCHE', name: 'Avalanche', symbol: 'AVAX', icon: '▲', color: '#E84142', category: 'Layer1', explorer: 'snowtrace.io', description: 'Fast smart contracts' },
  { id: 'COSMOS', name: 'Cosmos', symbol: 'ATOM', icon: '⚛', color: '#2E3148', category: 'Layer1', explorer: 'mintscan.io', description: 'Internet of blockchains' },
  { id: 'ALGORAND', name: 'Algorand', symbol: 'ALGO', icon: '◆', color: '#000000', category: 'Layer1', explorer: 'algoexplorer.io', description: 'Pure proof-of-stake' },
  { id: 'TEZOS', name: 'Tezos', symbol: 'XTZ', icon: 'ꜩ', color: '#2C7DF7', category: 'Layer1', explorer: 'tzstats.com', description: 'Self-amending blockchain' },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', icon: 'Ⓝ', color: '#00C08B', category: 'Layer1', explorer: 'explorer.near.org', description: 'Sharded blockchain' },
  { id: 'APTOS', name: 'Aptos', symbol: 'APT', icon: '🅰', color: '#00D4AA', category: 'Layer1', explorer: 'aptoscan.com', description: 'Move-based blockchain' },
  { id: 'SUI', name: 'Sui', symbol: 'SUI', icon: '🌊', color: '#4DA2FF', category: 'Layer1', explorer: 'suiscan.xyz', description: 'Next-gen smart contracts' },
  { id: 'HEDERA', name: 'Hedera', symbol: 'HBAR', icon: 'ℏ', color: '#000000', category: 'Layer1', explorer: 'hashscan.io', description: 'Hashgraph consensus' },
  { id: 'TRON', name: 'Tron', symbol: 'TRX', icon: '⚡', color: '#FF0013', category: 'Layer1', explorer: 'tronscan.org', description: 'Decentralized internet' },
  { id: 'RIPPLE', name: 'Ripple', symbol: 'XRP', icon: '✕', color: '#23292F', category: 'Layer1', explorer: 'xrpscan.com', description: 'Payment protocol' },
  { id: 'STELLAR', name: 'Stellar', symbol: 'XLM', icon: '⭐', color: '#000000', category: 'Layer1', explorer: 'stellarchain.io', description: 'Cross-border payments' },
  
  // Layer 2 & Sidechains
  { id: 'POLYGON', name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: '#8247E5', category: 'Layer2', explorer: 'polygonscan.com', description: 'Ethereum scaling' },
  { id: 'ARBITRUM', name: 'Arbitrum', symbol: 'ARB', icon: '🔷', color: '#28A0F0', category: 'Layer2', explorer: 'arbiscan.io', description: 'Optimistic rollup' },
  { id: 'OPTIMISM', name: 'Optimism', symbol: 'OP', icon: '🔴', color: '#FF0420', category: 'Layer2', explorer: 'optimistic.etherscan.io', description: 'Ethereum L2' },
  { id: 'BASE', name: 'Base', symbol: 'BASE', icon: '🔵', color: '#0052FF', category: 'Layer2', explorer: 'basescan.org', description: 'Coinbase L2' },
  { id: 'BNB_CHAIN', name: 'BNB Chain', symbol: 'BNB', icon: '◆', color: '#F3BA2F', category: 'Sidechain', explorer: 'bscscan.com', description: 'Binance ecosystem' },
  { id: 'FANTOM', name: 'Fantom', symbol: 'FTM', icon: '👻', color: '#1969FF', category: 'Layer1', explorer: 'ftmscan.com', description: 'DAG-based platform' },
  { id: 'CRONOS', name: 'Cronos', symbol: 'CRO', icon: '🦁', color: '#002D74', category: 'Sidechain', explorer: 'cronoscan.com', description: 'Crypto.com chain' },
  { id: 'MOONBEAM', name: 'Moonbeam', symbol: 'GLMR', icon: '🌙', color: '#53CBC9', category: 'Sidechain', explorer: 'moonscan.io', description: 'Polkadot parachain' },
  { id: 'CELO', name: 'Celo', symbol: 'CELO', icon: '🌱', color: '#FBCC5C', category: 'Layer1', explorer: 'celoscan.io', description: 'Mobile-first blockchain' }
];

export const getBlockchainInfo = (id: string): BlockchainInfo | undefined => {
  return BLOCKCHAINS.find(b => b.id === id);
};

export const getBlockchainsByCategory = (category: string) => {
  return BLOCKCHAINS.filter(b => b.category === category);
};

export const getBlockchainColor = (id: string): string => {
  return getBlockchainInfo(id)?.color || '#6B7280';
};

export const getBlockchainIcon = (id: string): string => {
  return getBlockchainInfo(id)?.icon || '⬢';
};
