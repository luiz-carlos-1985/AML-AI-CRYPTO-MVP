import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Wallets = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    blockchain: 'BITCOIN',
    label: ''
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const { data } = await api.get('/wallets');
      setWallets(data);
    } catch (error) {
      toast.error('Failed to load wallets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/wallets', formData);
      toast.success('Wallet added successfully');
      setShowModal(false);
      setFormData({ address: '', blockchain: 'BITCOIN', label: '' });
      loadWallets();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Wallets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </button>
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 shadow-2xl overflow-hidden rounded-2xl">
        <ul className="divide-y divide-slate-700/50">
          {wallets.map((wallet) => (
            <li key={wallet.id} className="px-6 py-5 hover:bg-slate-700/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <p className="text-base font-semibold text-white">{wallet.label || 'Unnamed Wallet'}</p>
                    <span className="px-3 py-1 text-xs rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 font-medium">
                      {wallet.blockchain}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 font-mono bg-slate-900/50 px-3 py-1 rounded-lg inline-block">{wallet.address}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    <span className="text-slate-400">
                      Transactions: <span className="text-white font-medium">{wallet._count?.transactions || 0}</span>
                    </span>
                    <span className="text-slate-400">
                      Alerts: <span className="text-white font-medium">{wallet._count?.alerts || 0}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-lg font-medium ${
                      wallet.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      wallet.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      wallet.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-red-600/30 text-red-300 border border-red-600/50'
                    }`}>
                      Risk: {wallet.riskLevel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="ml-4 p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
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
                <select
                  value={formData.blockchain}
                  onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="BITCOIN">Bitcoin</option>
                  <option value="ETHEREUM">Ethereum</option>
                  <option value="POLYGON">Polygon</option>
                  <option value="SOLANA">Solana</option>
                  <option value="BNB_CHAIN">BNB Chain</option>
                </select>
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
    </div>
  );
};

export default Wallets;
