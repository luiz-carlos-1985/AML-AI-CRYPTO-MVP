import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, DollarSign, Shield, Search } from 'lucide-react';

interface FilterConfig {
  dateRange?: { start: string; end: string };
  riskLevel?: string[];
  blockchain?: string[];
  amountRange?: { min: number; max: number };
  searchQuery?: string;
}

interface AdvancedFiltersProps {
  onApply: (filters: FilterConfig) => void;
  onReset: () => void;
}

export default function AdvancedFilters({ onApply, onReset }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});

  const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const blockchains = ['Ethereum', 'Bitcoin', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'];

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    onReset();
    setIsOpen(false);
  };

  const toggleRiskLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      riskLevel: prev.riskLevel?.includes(level)
        ? prev.riskLevel.filter(l => l !== level)
        : [...(prev.riskLevel || []), level]
    }));
  };

  const toggleBlockchain = (chain: string) => {
    setFilters(prev => ({
      ...prev,
      blockchain: prev.blockchain?.includes(chain)
        ? prev.blockchain.filter(c => c !== chain)
        : [...(prev.blockchain || []), chain]
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null
  ).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white rounded-xl font-medium hover:bg-slate-700 transition-all"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Search className="w-4 h-4" />
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by hash, address, or description..."
                    value={filters.searchQuery || ''}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={filters.dateRange?.start || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, start: e.target.value } as any
                      })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="date"
                      value={filters.dateRange?.end || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, end: e.target.value } as any
                      })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Shield className="w-4 h-4" />
                    Risk Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {riskLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => toggleRiskLevel(level)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.riskLevel?.includes(level)
                            ? level === 'LOW' ? 'bg-emerald-500 text-white'
                            : level === 'MEDIUM' ? 'bg-yellow-500 text-white'
                            : level === 'HIGH' ? 'bg-orange-500 text-white'
                            : 'bg-red-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blockchain */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-3 block">
                    Blockchain
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {blockchains.map((chain) => (
                      <button
                        key={chain}
                        onClick={() => toggleBlockchain(chain)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.blockchain?.includes(chain)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {chain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <DollarSign className="w-4 h-4" />
                    Amount Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.amountRange?.min || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        amountRange: { ...filters.amountRange, min: Number(e.target.value) } as any
                      })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.amountRange?.max || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        amountRange: { ...filters.amountRange, max: Number(e.target.value) } as any
                      })}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-700 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-slate-700/50 text-white rounded-xl font-medium hover:bg-slate-700 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
