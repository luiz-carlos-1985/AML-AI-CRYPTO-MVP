import { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data } = await api.get('/keys');
      setApiKeys(data);
    } catch (error) {
      toast.error('Failed to load API keys');
    }
  };

  const generateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      await api.post('/keys', { name: newKeyName });
      toast.success('API key generated successfully!');
      setNewKeyName('');
      setShowNewKeyModal(false);
      loadApiKeys();
    } catch (error) {
      toast.error('Failed to generate API key');
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      await api.delete(`/keys/${id}`);
      toast.success('API key deleted');
      loadApiKeys();
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 10)}${'*'.repeat(20)}${key.substring(key.length - 10)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">API Keys</h3>
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No API keys yet</p>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
          >
            Generate Your First Key
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{apiKey.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Created {format(new Date(apiKey.createdAt), 'MMM dd, yyyy')}
                  </p>
                  {apiKey.lastUsed && (
                    <p className="text-xs text-slate-500">
                      Last used {format(new Date(apiKey.lastUsed), 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      apiKey.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 font-mono text-sm text-white overflow-hidden">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                </div>
                <button
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                  title={visibleKeys.has(apiKey.id) ? 'Hide' : 'Show'}
                >
                  {visibleKeys.has(apiKey.id) ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => copyKey(apiKey.key)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                  title="Copy"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Use this key in your API requests with the header: <code className="text-emerald-400">Authorization: Bearer {'{'}your-key{'}'}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Generate New API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={generateKey}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Generate Key
                </button>
                <button
                  onClick={() => {
                    setShowNewKeyModal(false);
                    setNewKeyName('');
                  }}
                  className="flex-1 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;
