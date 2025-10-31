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
        <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {wallets.map((wallet) => (
            <li key={wallet.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{wallet.label || 'Unnamed Wallet'}</p>
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                      {wallet.blockchain}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 font-mono">{wallet.address}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      Transactions: {wallet._count?.transactions || 0}
                    </span>
                    <span className="text-gray-500">
                      Alerts: {wallet._count?.alerts || 0}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      wallet.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                      wallet.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      wallet.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                      'bg-red-900 text-white'
                    }`}>
                      Risk: {wallet.riskLevel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Wallet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blockchain</label>
                <select
                  value={formData.blockchain}
                  onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="BITCOIN">Bitcoin</option>
                  <option value="ETHEREUM">Ethereum</option>
                  <option value="POLYGON">Polygon</option>
                  <option value="SOLANA">Solana</option>
                  <option value="BNB_CHAIN">BNB Chain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Label (Optional)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Add Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
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
