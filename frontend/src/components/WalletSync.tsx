import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface SyncStatus {
  walletId: string;
  address: string;
  blockchain: string;
  status: 'syncing' | 'success' | 'error' | 'idle';
  lastSync: string | null;
  transactionsFound: number;
}

export default function WalletSync() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    if (autoSync && syncStatuses.length > 0) {
      const interval = setInterval(() => {
        syncAll();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [autoSync, syncStatuses.length]);

  const loadWallets = async () => {
    try {
      const { data } = await api.get('/wallets');
      setSyncStatuses(data.map((w: any) => ({
        walletId: w.id,
        address: w.address,
        blockchain: w.blockchain,
        status: 'idle',
        lastSync: w.lastSync || null,
        transactionsFound: 0
      })));
    } catch (error) {
      console.error('Failed to load wallets');
    }
  };

  const syncWallet = async (walletId: string) => {
    setSyncStatuses(prev => prev.map(s => 
      s.walletId === walletId ? { ...s, status: 'syncing' } : s
    ));

    try {
      const { data } = await api.post(`/wallets/${walletId}/sync`);
      
      setSyncStatuses(prev => prev.map(s => 
        s.walletId === walletId ? {
          ...s,
          status: 'success',
          lastSync: new Date().toISOString(),
          transactionsFound: data.transactionsFound || 0
        } : s
      ));

      if (data.transactionsFound > 0) {
        toast.success(`${data.transactionsFound} new transactions found!`);
      }
    } catch (error) {
      setSyncStatuses(prev => prev.map(s => 
        s.walletId === walletId ? { ...s, status: 'error' } : s
      ));
      toast.error('Sync failed');
    }
  };

  const syncAll = async () => {
    if (syncing) return;
    
    setSyncing(true);
    
    for (const wallet of syncStatuses) {
      await syncWallet(wallet.walletId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between syncs
    }
    
    setSyncing(false);
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

  return (
    <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Wallet Synchronization</h2>
          <p className="text-xs sm:text-sm text-slate-400">Auto-sync transactions from blockchain</p>
        </div>
        <div className="flex items-center gap-3">
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
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 text-sm touch-target"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync All
          </button>
        </div>
      </div>

      {syncStatuses.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No wallets to sync</p>
        </div>
      ) : (
        <div className="space-y-3">
          {syncStatuses.map((wallet, index) => (
            <motion.div
              key={wallet.walletId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 sm:p-4 rounded-xl border ${getStatusColor(wallet.status)} transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(wallet.status)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">
                        {wallet.blockchain}
                      </span>
                      {wallet.transactionsFound > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-medium">
                          +{wallet.transactionsFound} txs
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white font-mono truncate">{wallet.address}</p>
                    {wallet.lastSync && (
                      <p className="text-xs text-slate-500 mt-1">
                        Last sync: {new Date(wallet.lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => syncWallet(wallet.walletId)}
                  disabled={wallet.status === 'syncing'}
                  className="self-end sm:self-auto px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-sm transition-all disabled:opacity-50 touch-target"
                >
                  Sync
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-start gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-400 mb-1">Auto-Sync Active</p>
            <p className="text-xs text-blue-300/80">
              Wallets are automatically synced every 60 seconds to detect new transactions in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
