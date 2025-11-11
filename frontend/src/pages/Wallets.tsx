import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Lock, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BLOCKCHAINS, getBlockchainInfo } from '../utils/blockchains';
import { canAddWallet, getPlanLimits } from '../utils/planLimits';
import UpgradePrompt from '../components/UpgradePrompt';
import { useAuth } from '../hooks/useAuth';

const Wallets = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    blockchain: 'BITCOIN',
    label: ''
  });
  
  const planLimits = getPlanLimits(user?.plan || 'STARTER');
  const canAdd = canAddWallet(wallets.length, user?.plan || 'STARTER');

  useEffect(() => {
    loadWallets();
    
    const interval = setInterval(() => {
      loadWallets();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadWallets = async () => {
    try {
      const { data } = await api.get('/wallets');
      console.log('=== WALLETS DATA ===');
      console.log('Total wallets:', data.length);
      data.forEach((w: any, i: number) => {
        console.log(`Wallet ${i+1}:`, {
          label: w.label,
          address: w.address,
          _count: w._count,
          transactionCount: w._count?.transactions,
          alertCount: w._count?.alerts
        });
      });
      setWallets(data);
    } catch (error: any) {
      console.error('Failed to load wallets:', error);
      toast.error(error.response?.data?.error || 'Failed to load wallets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/wallets', formData);
      toast.success('Wallet added successfully');
      setShowModal(false);
      setFormData({ address: '', blockchain: 'BITCOIN', label: '' });
      
      setTimeout(async () => {
        await handleSync(data.id);
        loadWallets();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add wallet');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;
    
    try {
      await api.delete(`/wallets/${id}`);
      toast.success('Wallet deleted');
      loadWallets();
    } catch (error) {
      toast.error('Failed to delete wallet');
    }
  };

  const handleSync = async (id: string) => {
    try {
      toast.loading('Syncing wallet...', { id: 'sync' });
      await api.post(`/wallets/${id}/sync`);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadWallets();
      
      toast.success('Wallet synchronized', { id: 'sync' });
    } catch (error) {
      toast.error('Failed to sync wallet', { id: 'sync' });
    }
  };

  const handleAddWalletClick = () => {
    if (!canAdd) {
      setShowUpgradePrompt(true);
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Plan Limit Banner */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Wallet Usage</p>
            <p className="text-lg font-bold text-white">
              {wallets.length} / {planLimits.maxWallets === -1 ? '∞' : planLimits.maxWallets} wallets
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Current Plan</p>
            <p className="text-lg font-bold text-emerald-400">{user?.plan}</p>
          </div>
        </div>
        {!canAdd && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-amber-400 text-sm flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              You've reached your wallet limit. Upgrade to add more wallets.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t('wallets.title')}</h1>
        <button
          onClick={handleAddWalletClick}
          disabled={!canAdd}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            canAdd
              ? 'text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transform hover:scale-105'
              : 'text-slate-400 bg-slate-700/50 cursor-not-allowed opacity-50'
          }`}
        >
          {canAdd ? <Plus className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
          Add Wallet
        </button>
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 shadow-2xl overflow-hidden rounded-2xl">
        {wallets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 text-lg">No wallets added yet.</p>
            <p className="text-slate-500 text-sm mt-2">Click "Add Wallet" to start monitoring your crypto addresses.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-700/50">
            {wallets.map((wallet) => (
            <li key={wallet.id} className="px-4 md:px-6 py-4 md:py-5 hover:bg-slate-700/30 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-white">{wallet.label || 'Unnamed Wallet'}</p>
                    <span className="px-2 md:px-3 py-1 text-xs rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 font-medium">
                      {wallet.blockchain}
                    </span>
                  </div>
                  <p className="mt-2 text-xs md:text-sm text-slate-400 font-mono bg-slate-900/50 px-2 md:px-3 py-1 rounded-lg inline-block break-all">{wallet.address}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Transactions: <span className="text-white font-medium">{wallet._count?.transactions || 0}</span>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Alerts: <span className="text-white font-medium">{wallet._count?.alerts || 0}</span>
                    </span>
                    <span className={`px-2 md:px-3 py-1 rounded-lg font-medium text-xs ${
                      wallet.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      wallet.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      wallet.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-red-600/30 text-red-300 border border-red-600/50'
                    }`}>
                      Risk: {wallet.riskLevel}
                    </span>
                  </div>
                  {(wallet._count?.transactions || 0) === 0 && (
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-400 flex items-center gap-2">
                        <RefreshCw className="w-3 h-3" />
                        Clique em sincronizar para buscar transações
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 md:ml-4">
                  <button
                    onClick={() => handleSync(wallet.id)}
                    className="flex-1 md:flex-none p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-200"
                    title="Sync wallet"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="flex-1 md:flex-none p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                    title="Delete wallet"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Add New Wallet</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter wallet address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Blockchain</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blockchain..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <select
                  value={formData.blockchain}
                  onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all max-h-48 overflow-y-auto"
                  size={8}
                >
                  {BLOCKCHAINS
                    .filter(blockchain => 
                      blockchain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      blockchain.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      blockchain.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(blockchain => (
                      <option key={blockchain.id} value={blockchain.id}>
                        {blockchain.icon} {blockchain.name} ({blockchain.symbol})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  {getBlockchainInfo(formData.blockchain)?.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Label (Optional)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="My Wallet"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-105"
                >
                  Add Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700/50 text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-700 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          feature="Additional Wallets"
          requiredPlan="GROWTH"
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default Wallets;
