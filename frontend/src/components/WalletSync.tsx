import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Zap, TrendingUp, Activity, Wifi, WifiOff } from 'lucide-react';
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
        transactionCount: undefined
      })));
    } catch (error) {
      console.error('Failed to load wallets:', error);
      toast.error('Failed to load wallets');
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
          syncDuration: duration
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

      toast.error(error.response?.data?.error || 'Sync failed');
    }
  }, []);

  const syncAll = async () => {
    if (syncing || syncStatuses.length === 0) return;
    
    setSyncing(true);
    setLastSyncTime(new Date());
    
    const promises = syncStatuses.map(wallet => syncWallet(wallet.walletId));
    await Promise.all(promises);
    
    setSyncing(false);
    toast.success('All wallets synced!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
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

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const successRate = stats.totalSyncs > 0 
    ? ((stats.successfulSyncs / stats.totalSyncs) * 100).toFixed(1) 
    : '0';

  return (
    <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">Wallet Synchronization</h2>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time blockchain monitoring • {syncStatuses.length} wallets
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={syncInterval}
            onChange={(e) => setSyncInterval(Number(e.target.value))}
            className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none"
          >
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>2min</option>
            <option value={300}>5min</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-slate-300">Auto-sync</span>
          </label>
          <button
            onClick={syncAll}
            disabled={syncing || !isOnline}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 text-sm touch-target shadow-lg shadow-blue-500/20"
          >
            <Zap className={`w-4 h-4 ${syncing ? 'animate-pulse' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Total Syncs</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.totalSyncs}</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Success Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{successRate}%</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Avg Time</span>
          </div>
          <p className="text-xl font-bold text-white">{formatDuration(stats.averageSyncTime)}</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Txs Found</span>
          </div>
          <p className="text-xl font-bold text-white">{stats.totalTransactionsFound}</p>
        </motion.div>
      </div>

      {/* Wallets List */}
      {syncStatuses.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No wallets to sync</p>
          <p className="text-sm">Add wallets to start monitoring</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {syncStatuses.map((wallet, index) => (
              <motion.div
                key={wallet.walletId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                className={`p-4 rounded-xl border ${getStatusColor(wallet.status)} transition-all hover:shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1">
                      {getStatusIcon(wallet.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-medium border border-blue-500/30">
                          {wallet.blockchain}
                        </span>
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
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {wallet.balance && (
                          <span>Balance: {parseFloat(wallet.balance).toFixed(4)}</span>
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
                    className="self-end sm:self-auto px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-sm transition-all disabled:opacity-50 touch-target font-medium"
                  >
                    {wallet.status === 'syncing' ? 'Syncing...' : 'Sync'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-400 mb-1">
              {autoSync ? '⚡ Auto-Sync Active' : '⏸️ Auto-Sync Paused'}
            </p>
            <p className="text-xs text-blue-300/80">
              {autoSync 
                ? `Monitoring ${syncStatuses.length} wallets every ${syncInterval}s for new transactions`
                : 'Enable auto-sync to monitor wallets automatically'
              }
              {lastSyncTime && ` • Last sync: ${lastSyncTime.toLocaleTimeString()}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
