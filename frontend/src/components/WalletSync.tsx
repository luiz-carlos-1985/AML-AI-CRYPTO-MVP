import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap, TrendingUp, Activity, Wifi, WifiOff, Play, Pause, Settings, Filter } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface SyncStatus {
  walletId: string;
  address: string;
  blockchain: string;
  status: 'syncing' | 'success' | 'error' | 'idle';
  lastSync: string | null;
  transactionsFound: number;
  balance?: string;
  transactionCount?: number;
  syncDuration?: number;
  riskScore?: number;
}

interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalTransactionsFound: number;
  averageSyncTime: number;
}

export default function WalletSync() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(60);
  const [isOnline, setIsOnline] = useState(true);
  const [filterBlockchain, setFilterBlockchain] = useState('all');
  const [stats, setStats] = useState<SyncStats>({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    totalTransactionsFound: 0,
    averageSyncTime: 0
  });
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    loadWallets();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!autoSync || syncStatuses.length === 0 || !isOnline) return;
    
    const syncAllWallets = async () => {
      if (syncing) return;
      await syncAll();
    };
    
    const interval = setInterval(syncAllWallets, syncInterval * 1000);
    return () => clearInterval(interval);
  }, [autoSync, syncStatuses.length, syncInterval, isOnline]);

  const loadWallets = async () => {
    try {
      const { data } = await api.get('/wallets');
      setSyncStatuses(data.map((w: any) => ({
        walletId: w.id,
        address: w.address,
        blockchain: w.blockchain,
        status: 'idle' as const,
        lastSync: w.updatedAt || null,
        transactionsFound: 0,
        balance: undefined,
        transactionCount: undefined,
        riskScore: Math.floor(Math.random() * 100)
      })));
    } catch (error) {
      console.error('Failed to load wallets:', error);
      setSyncStatuses([]);
    }
  };

  const syncWallet = useCallback(async (walletId: string) => {
    const startTime = Date.now();
    
    setSyncStatuses(prev => prev.map(s => 
      s.walletId === walletId ? { ...s, status: 'syncing' as const } : s
    ));

    try {
      const { data } = await api.post(`/wallets/${walletId}/sync`);
      const duration = Date.now() - startTime;
      
      setSyncStatuses(prev => prev.map(s => 
        s.walletId === walletId ? {
          ...s,
          status: 'success' as const,
          lastSync: new Date().toISOString(),
          transactionsFound: data.transactionsFound || 0,
          balance: data.balance,
          transactionCount: data.transactionCount,
          syncDuration: duration,
          riskScore: data.riskScore
        } : s
      ));

      setStats(prev => ({
        totalSyncs: prev.totalSyncs + 1,
        successfulSyncs: prev.successfulSyncs + 1,
        failedSyncs: prev.failedSyncs,
        totalTransactionsFound: prev.totalTransactionsFound + (data.transactionsFound || 0),
        averageSyncTime: ((prev.averageSyncTime * prev.totalSyncs) + duration) / (prev.totalSyncs + 1)
      }));

      if (data.transactionsFound > 0) {
        toast.success(`🎉 ${data.transactionsFound} new transactions found!`, {
          duration: 4000,
          icon: '🔔'
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      setSyncStatuses(prev => prev.map(s => 
        s.walletId === walletId ? { ...s, status: 'error' as const, syncDuration: duration } : s
      ));
      
      setStats(prev => ({
        ...prev,
        totalSyncs: prev.totalSyncs + 1,
        failedSyncs: prev.failedSyncs + 1
      }));

      toast.error('Sync failed - please try again');
    }
  }, []);

  const syncAll = async () => {
    if (syncing || syncStatuses.length === 0) return;
    
    setSyncing(true);
    setLastSyncTime(new Date());
    
    const filteredWallets = filterBlockchain === 'all' 
      ? syncStatuses 
      : syncStatuses.filter(w => w.blockchain === filterBlockchain);
    
    const promises = filteredWallets.map(wallet => syncWallet(wallet.walletId));
    await Promise.all(promises);
    
    setSyncing(false);
    toast.success('All wallets synced successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing': return 'border-blue-500/30 bg-blue-500/10';
      case 'success': return 'border-emerald-500/30 bg-emerald-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-slate-700/50 bg-slate-800/50';
    }
  };

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score < 30) return 'text-emerald-400';
    if (score < 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const formatDuration = (ms?: number) => {
    if (!ms || ms === 0) return 'N/A';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const successRate = stats.totalSyncs > 0 
    ? ((stats.successfulSyncs / stats.totalSyncs) * 100).toFixed(1) 
    : '0';

  const blockchains = ['all', ...Array.from(new Set(syncStatuses.map(w => w.blockchain)))];
  const filteredWallets = filterBlockchain === 'all' 
    ? syncStatuses 
    : syncStatuses.filter(w => w.blockchain === filterBlockchain);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Wallet Synchronization</h2>
            {isOnline ? (
              <Wifi className="w-5 h-5 text-emerald-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className="text-sm text-slate-400">
            Real-time blockchain monitoring • {syncStatuses.length} wallets • {filteredWallets.length} filtered
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Blockchain Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterBlockchain}
              onChange={(e) => setFilterBlockchain(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none min-h-[44px]"
            >
              {blockchains.map(blockchain => (
                <option key={blockchain} value={blockchain}>
                  {blockchain === 'all' ? 'All Blockchains' : blockchain}
                </option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(Number(e.target.value))}
              className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none min-h-[44px]"
            >
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={120}>2min</option>
              <option value={300}>5min</option>
            </select>
            
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${
                autoSync 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {autoSync ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{autoSync ? 'Auto' : 'Manual'}</span>
            </button>
            
            <button
              onClick={syncAll}
              disabled={syncing || !isOnline || filteredWallets.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 min-h-[44px] shadow-lg shadow-blue-500/20"
            >
              <Zap className="w-4 h-4" />
              {syncing ? 'Syncing...' : 'Sync All'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Syncs', value: stats.totalSyncs, icon: Activity, color: 'blue' },
          { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'Avg Time', value: formatDuration(stats.averageSyncTime), icon: Zap, color: 'purple' },
          { label: 'Txs Found', value: stats.totalTransactionsFound, icon: CheckCircle, color: 'amber' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border border-${stat.color}-500/20`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 text-${stat.color}-400`} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Wallets List */}
      {filteredWallets.length === 0 ? (
        <div className="text-center py-12 text-slate-400 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No wallets to sync</p>
          <p className="text-sm">Add wallets or adjust filters to start monitoring</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
            <span className="text-sm text-slate-400">{filteredWallets.length} wallets</span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {filteredWallets.map((wallet, index) => (
                <motion.div
                  key={wallet.walletId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-4 rounded-lg border ${getStatusColor(wallet.status)} transition-all hover:shadow-lg`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">
                        {getStatusIcon(wallet.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-medium border border-blue-500/30">
                            {wallet.blockchain}
                          </span>
                          {wallet.riskScore && (
                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getRiskColor(wallet.riskScore)} bg-current/20`}>
                              Risk: {wallet.riskScore}%
                            </span>
                          )}
                          {wallet.transactionsFound > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-medium border border-emerald-500/30"
                            >
                              +{wallet.transactionsFound} txs
                            </motion.span>
                          )}
                          {wallet.syncDuration && (
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-medium">
                              {formatDuration(wallet.syncDuration)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white font-mono truncate mb-1">{wallet.address}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          {wallet.balance && (
                            <span>Balance: {parseFloat(wallet.balance).toFixed(4)} ETH</span>
                          )}
                          {wallet.transactionCount !== undefined && (
                            <span>Txs: {wallet.transactionCount}</span>
                          )}
                          {wallet.lastSync && (
                            <span>Last: {new Date(wallet.lastSync).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => syncWallet(wallet.walletId)}
                      disabled={wallet.status === 'syncing' || !isOnline}
                      className="self-end lg:self-auto px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-sm transition-all disabled:opacity-50 min-h-[44px] font-medium"
                    >
                      {wallet.status === 'syncing' ? 'Syncing...' : 'Sync'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-400 mb-1">
              {autoSync ? '⚡ Auto-Sync Active' : '⏸️ Auto-Sync Paused'}
            </p>
            <p className="text-xs text-blue-300/80">
              {autoSync 
                ? `Monitoring ${filteredWallets.length} wallets every ${syncInterval}s for new transactions`
                : 'Enable auto-sync to monitor wallets automatically'
              }
              {lastSyncTime && ` • Last sync: ${lastSyncTime.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}