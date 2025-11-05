import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Trash2, Eye, EyeOff, ExternalLink, CheckCircle, XCircle, Copy, AlertCircle, Shield, Lock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ApiConfig {
  id: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export default function ApiSettings() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [newConfig, setNewConfig] = useState({ provider: 'etherscan', apiKey: '' });
  const [showModal, setShowModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [testingKey, setTestingKey] = useState<string | null>(null);

  const providers = [
    { value: 'etherscan', label: 'Etherscan', blockchain: 'Ethereum', url: 'https://etherscan.io/apis', icon: '⟠', color: 'from-blue-500 to-blue-600' },
    { value: 'blockstream', label: 'Blockstream', blockchain: 'Bitcoin', url: 'https://blockstream.info/api', icon: '₿', color: 'from-orange-500 to-orange-600' },
    { value: 'polygonscan', label: 'PolygonScan', blockchain: 'Polygon', url: 'https://polygonscan.com/apis', icon: '⬡', color: 'from-purple-500 to-purple-600' },
    { value: 'bscscan', label: 'BscScan', blockchain: 'BSC', url: 'https://bscscan.com/apis', icon: '◆', color: 'from-yellow-500 to-yellow-600' },
    { value: 'arbiscan', label: 'Arbiscan', blockchain: 'Arbitrum', url: 'https://arbiscan.io/apis', icon: '🔷', color: 'from-blue-400 to-blue-500' },
    { value: 'optimistic', label: 'Optimistic Etherscan', blockchain: 'Optimism', url: 'https://optimistic.etherscan.io/apis', icon: '🔴', color: 'from-red-500 to-red-600' },
    { value: 'snowtrace', label: 'Snowtrace', blockchain: 'Avalanche', url: 'https://snowtrace.io/apis', icon: '🔺', color: 'from-red-400 to-red-500' },
    { value: 'ftmscan', label: 'FTMScan', blockchain: 'Fantom', url: 'https://ftmscan.com/apis', icon: '👻', color: 'from-blue-300 to-blue-400' }
  ];

  const loadConfigs = async () => {
    try {
      const { data } = await api.get('/config');
      setConfigs(data);
    } catch (error) {
      toast.error('Failed to load configurations');
    }
  };

  const saveConfig = async () => {
    if (!newConfig.apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    try {
      await api.post('/config', newConfig);
      toast.success('API configuration saved!');
      loadConfigs();
      setNewConfig({ provider: 'etherscan', apiKey: '' });
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save configuration');
    }
  };

  const toggleConfig = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/config/${id}/toggle`);
      toast.success(isActive ? 'API disabled' : 'API enabled');
      loadConfigs();
    } catch (error) {
      toast.error('Failed to toggle configuration');
    }
  };

  const deleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API configuration?')) return;

    try {
      await api.delete(`/config/${id}`);
      toast.success('Configuration deleted');
      loadConfigs();
    } catch (error) {
      toast.error('Failed to delete configuration');
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

  const testApiKey = async (id: string, provider: string) => {
    setTestingKey(id);
    try {
      await api.get(`/config/${id}/test`);
      toast.success('API key is working! ✅');
    } catch (error) {
      toast.error('API key test failed');
    } finally {
      setTestingKey(null);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-purple-400 mb-2">🔒 Your Privacy & Data Security</h3>
            <div className="space-y-1.5 text-xs sm:text-sm text-purple-300/80">
              <p>• <strong>Encryption:</strong> All API keys encrypted with AES-256 before storage</p>
              <p>• <strong>Usage:</strong> Keys only used to fetch blockchain data on your behalf</p>
              <p>• <strong>Privacy:</strong> Never shared with third parties or logged</p>
              <p>• <strong>Control:</strong> Delete configurations anytime - data permanently removed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Blockchain API Configuration</h1>
            <p className="text-sm sm:text-base text-slate-400">Configure your blockchain API keys</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </button>
        </div>
      </motion.div>

      {/* Configured APIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Configured APIs</h2>
        
        {configs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {configs.map((config) => {
              const provider = providers.find(p => p.value === config.provider);
              return (
                <div key={config.id} className="p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${provider?.color} flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}>
                        {provider?.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base text-white font-medium truncate">{provider?.label}</h3>
                        <p className="text-xs text-slate-500">{provider?.blockchain}</p>
                      </div>
                    </div>
                    {config.isActive ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                    <button
                      onClick={() => toggleKeyVisibility(config.id)}
                      className="p-1.5 sm:p-2 hover:bg-slate-700 rounded transition-all touch-target"
                      title="Show/Hide"
                    >
                      {visibleKeys.has(config.id) ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => testApiKey(config.id, config.provider)}
                      disabled={testingKey === config.id}
                      className="p-1.5 sm:p-2 hover:bg-blue-500/20 rounded transition-all disabled:opacity-50 touch-target"
                      title="Test"
                    >
                      <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => toggleConfig(config.id, config.isActive)}
                      className={`flex-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all touch-target ${
                        config.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {config.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded transition-all touch-target"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Added {new Date(config.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <Key className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-slate-400 mb-3 sm:mb-4 px-4">No API configurations yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 sm:px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all text-sm sm:text-base touch-target"
            >
              Add Your First API Key
            </button>
          </div>
        )}
      </motion.div>

      {/* Available Providers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Supported Providers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {providers.map((provider) => (
            <a
              key={provider.value}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all group touch-target"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <span className="text-xl sm:text-2xl">{provider.icon}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-all" />
              </div>
              <p className="text-xs sm:text-sm text-white font-medium truncate">{provider.label}</p>
              <p className="text-xs text-slate-500">{provider.blockchain}</p>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Add API Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Add API Configuration</h3>
            
            <div className="p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-3 sm:mb-4">
              <div className="flex gap-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-400 mb-1">Security Guarantee</p>
                  <p className="text-xs text-emerald-300/80">
                    Your API keys are encrypted with AES-256 before storage. We never share, sell, or expose your keys to third parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Provider</label>
                <select
                  value={newConfig.provider}
                  onChange={(e) => setNewConfig({...newConfig, provider: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {providers.map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.icon} {provider.label} ({provider.blockchain})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">API Key</label>
                <input
                  type="password"
                  placeholder="Paste your API key here"
                  value={newConfig.apiKey}
                  onChange={(e) => setNewConfig({...newConfig, apiKey: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && saveConfig()}
                />
                <a
                  href={providers.find(p => p.value === newConfig.provider)?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2 touch-target"
                >
                  Get API key from {providers.find(p => p.value === newConfig.provider)?.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-400">
                    Your API keys are encrypted and stored securely. They're only used for blockchain data retrieval.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={saveConfig}
                  className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm sm:text-base touch-target"
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewConfig({ provider: 'etherscan', apiKey: '' });
                  }}
                  className="flex-1 py-2.5 sm:py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all text-sm sm:text-base touch-target"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}