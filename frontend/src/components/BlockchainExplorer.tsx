import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Copy, TrendingUp, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'address' | 'transaction' | 'block'>('address');

  const recentSearches = [
    { type: 'address', value: '0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a', blockchain: 'Ethereum' },
    { type: 'transaction', value: '0x8f3d...9a2c', blockchain: 'Bitcoin' },
    { type: 'address', value: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', blockchain: 'Polygon' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    toast.success('Searching blockchain...');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Blockchain Explorer</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="address">Address</option>
            <option value="transaction">Transaction</option>
            <option value="block">Block</option>
          </select>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 pl-12 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all text-sm touch-target"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Total Transactions</span>
            </div>
            <div className="text-xl font-bold text-white">2.4M</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Unique Addresses</span>
            </div>
            <div className="text-xl font-bold text-white">156K</div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Total Volume</span>
            </div>
            <div className="text-xl font-bold text-white">$8.2B</div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">Recent Searches</h3>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                    {search.type}
                  </span>
                  <span className="text-xs text-slate-500">{search.blockchain}</span>
                </div>
                <p className="text-sm text-white font-mono truncate">{search.value}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => copyToClipboard(search.value)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-all touch-target"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-all touch-target">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
