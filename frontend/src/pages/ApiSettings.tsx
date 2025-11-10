import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Trash2, Eye, EyeOff, ExternalLink, CheckCircle, XCircle, Shield, Zap, RefreshCw, Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ApiConfig {
  id: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export default function ApiSettings() {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [newConfig, setNewConfig] = useState({ provider: 'etherscan', apiKey: '' });
  const [showModal, setShowModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [testingKey, setTestingKey] = useState<string | null>(null);

  const providers = [
    { 
      value: 'etherscan', 
      label: 'Etherscan', 
      blockchain: 'Ethereum, Polygon, BSC, Arbitrum, Optimism', 
      url: 'https://etherscan.io/apis', 
      icon: '⟠', 
      color: 'from-blue-500 to-blue-600',
      description: 'API universal para múltiplas redes EVM',
      free: '100k req/dia'
    },
    { 
      value: 'alchemy', 
      label: 'Alchemy', 
      blockchain: 'Ethereum Sepolia (Testnet)', 
      url: 'https://www.alchemy.com/', 
      icon: '🔮', 
      color: 'from-purple-500 to-purple-600',
      description: 'Infraestrutura blockchain profissional',
      free: '300M compute units/mês'
    },
    { 
      value: 'blockstream', 
      label: 'Blockstream', 
      blockchain: 'Bitcoin', 
      url: 'https://blockstream.info/api', 
      icon: '₿', 
      color: 'from-orange-500 to-orange-600',
      description: 'API pública Bitcoin (sem chave necessária)',
      free: 'Ilimitado'
    }
  ];

  const loadConfigs = async () => {
    try {
      const { data } = await api.get('/config');
      setConfigs(data);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    }
  };

  const saveConfig = async () => {
    if (!newConfig.apiKey.trim()) {
      toast.error('Por favor, insira uma API key');
      return;
    }

    try {
      await api.post('/config', newConfig);
      toast.success('✅ API configurada com sucesso!');
      loadConfigs();
      setNewConfig({ provider: 'etherscan', apiKey: '' });
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar configuração');
    }
  };

  const toggleConfig = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/config/${id}/toggle`);
      toast.success(isActive ? 'API desativada' : 'API ativada');
      loadConfigs();
    } catch (error) {
      toast.error('Erro ao alternar configuração');
    }
  };

  const deleteConfig = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta configuração?')) return;

    try {
      await api.delete(`/config/${id}`);
      toast.success('Configuração deletada');
      loadConfigs();
    } catch (error) {
      toast.error('Erro ao deletar configuração');
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
      toast.success('✅ API key funcionando perfeitamente!');
    } catch (error) {
      toast.error('❌ Falha no teste da API key');
    } finally {
      setTestingKey(null);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const selectedProvider = providers.find(p => p.value === newConfig.provider);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 animate-pulse"></div>
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                🔑 {t('apiKeys.title')}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                {t('apiKeys.subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('apiKeys.addKey')}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t('apiKeys.security')}</p>
                <p className="text-sm font-bold text-white">AES-256</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t('apiKeys.configured')}</p>
                <p className="text-sm font-bold text-white">{configs.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{t('apiKeys.status')}</p>
                <p className="text-sm font-bold text-white">
                  {configs.filter(c => c.isActive).length} {t('apiKeys.active')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Setup Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-400 mb-3">⚡ {t('apiKeys.quickSetup')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
                  <span className="text-emerald-400 font-bold">1</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{t('apiKeys.step1')}</p>
                <p className="text-xs text-slate-400">{t('apiKeys.step1Desc')}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{t('apiKeys.step2')}</p>
                <p className="text-xs text-slate-400">{t('apiKeys.step2Desc')}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{t('apiKeys.step3')}</p>
                <p className="text-xs text-slate-400">{t('apiKeys.step3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configured APIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-400" />
          {t('apiKeys.yourApis')}
        </h2>
        
        {configs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {configs.map((config) => {
              const provider = providers.find(p => p.value === config.provider);
              return (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-br from-slate-900/80 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${provider?.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {provider?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg text-white font-bold">{provider?.label}</h3>
                        <p className="text-xs text-slate-400 truncate">{provider?.blockchain}</p>
                        <p className="text-xs text-emerald-400 mt-1">✓ {provider?.free}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.isActive ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold">
                          <CheckCircle className="w-3 h-3" />
                          {t('apiKeys.active')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs font-bold">
                          <XCircle className="w-3 h-3" />
                          Inativa
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(config.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-all text-sm text-slate-300"
                    >
                      {visibleKeys.has(config.id) ? (
                        <><EyeOff className="w-4 h-4" /> {t('apiKeys.hide')}</>
                      ) : (
                        <><Eye className="w-4 h-4" /> {t('apiKeys.show')}</>
                      )}
                    </button>
                    <button
                      onClick={() => testApiKey(config.id, config.provider)}
                      disabled={testingKey === config.id}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all text-sm text-blue-400 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${testingKey === config.id ? 'animate-spin' : ''}`} />
                      {testingKey === config.id ? t('apiKeys.testing') : t('apiKeys.test')}
                    </button>
                    <button
                      onClick={() => toggleConfig(config.id, config.isActive)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        config.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {config.isActive ? t('apiKeys.deactivate') : t('apiKeys.activate')}
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-sm text-red-400 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('apiKeys.delete')}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    {t('apiKeys.addedOn')} {new Date(config.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-lg text-slate-300 mb-2 font-medium">{t('apiKeys.noApis')}</p>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              {t('apiKeys.noApisDesc')}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-5 h-5" />
              {t('apiKeys.addFirstKey')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Providers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">🌐 {t('apiKeys.providers')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <a
              key={provider.value}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-gradient-to-br from-slate-900/80 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${provider.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {provider.icon}
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{provider.label}</h3>
              <p className="text-xs text-slate-400 mb-2">{provider.blockchain}</p>
              <p className="text-xs text-slate-500 mb-3">{provider.description}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <Zap className="w-3 h-3" />
                {provider.free}
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Add API Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-slate-800/95 border border-slate-700/50 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-400" />
              {t('apiKeys.modalTitle')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  1️⃣ {t('apiKeys.chooseProvider')}
                </label>
                <select
                  value={newConfig.provider}
                  onChange={(e) => setNewConfig({...newConfig, provider: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {providers.map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.icon} {provider.label} - {provider.blockchain}
                    </option>
                  ))}
                </select>
                {selectedProvider && (
                  <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-400">{selectedProvider.description}</p>
                    <p className="text-xs text-emerald-400 mt-1">✓ Plano gratuito: {selectedProvider.free}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm font-medium text-white mb-2">2️⃣ {t('apiKeys.getKey')}</p>
                <a
                  href={selectedProvider?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium"
                >
                  {t('apiKeys.goTo')} {selectedProvider?.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  3️⃣ {t('apiKeys.pasteKey')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('apiKeys.pasteKeyPlaceholder')}
                    value={newConfig.apiKey}
                    onChange={(e) => setNewConfig({...newConfig, apiKey: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && saveConfig()}
                    onPaste={() => toast.success('✅ Chave colada!')}
                  />
                  {newConfig.apiKey && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  )}
                </div>
                {newConfig.apiKey && (
                  <p className="text-xs text-slate-500 mt-2">
                    ✓ {newConfig.apiKey.length} {t('apiKeys.characters')}
                  </p>
                )}
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <div className="flex gap-2">
                  <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-purple-400 mb-1">🔒 {t('apiKeys.secureNotice')}</p>
                    <p className="text-xs text-purple-300/80">
                      {t('apiKeys.secureDesc')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveConfig}
                  disabled={!newConfig.apiKey.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
                >
                  {t('apiKeys.save')}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewConfig({ provider: 'etherscan', apiKey: '' });
                  }}
                  className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all"
                >
                  {t('apiKeys.cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
