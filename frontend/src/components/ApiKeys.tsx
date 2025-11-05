import { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Eye, EyeOff, Plus, Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import InfoTooltip from './InfoTooltip';

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [selectedLang, setSelectedLang] = useState<{[key: string]: string}>({});

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

  const testApiKey = async (key: string) => {
    try {
      toast.loading('Testing API key...');
      const response = await api.get('/wallets', {
        headers: { Authorization: `Bearer ${key}` }
      });
      toast.dismiss();
      toast.success('API key is working! ✅');
    } catch (error) {
      toast.dismiss();
      toast.error('API key test failed');
    }
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 10)}${'*'.repeat(20)}${key.substring(key.length - 10)}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Security Notice */}
      <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-emerald-400 mb-1">🔒 Your Security is Our Priority</h4>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              All API keys are encrypted using AES-256 encryption before storage. Keys are only decrypted when making authorized requests on your behalf. We never share or expose your keys to third parties.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-white">API Keys</h3>
          <InfoTooltip
            type="info"
            title="What are API Keys?"
            description="API keys allow you to programmatically access CryptoAML features. Each key is unique and can be used to authenticate your requests to our API endpoints. You can generate multiple keys for different applications or environments."
          />
        </div>
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-sm sm:text-base touch-target"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <Key className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-slate-400 mb-2 px-4">No API keys yet</p>
          <p className="text-xs text-slate-500 mb-3 sm:mb-4 px-4">Generate your first API key to start integrating CryptoAML into your applications</p>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="px-4 sm:px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all text-sm sm:text-base touch-target"
          >
            Generate Your First Key
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base text-white font-medium truncate">{apiKey.name}</h4>
                    <InfoTooltip
                      type="security"
                      title="Key Security"
                      description="This key is encrypted in our database. Only you can see the full key. If compromised, delete it immediately and generate a new one."
                    />
                  </div>
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
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      apiKey.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                <div className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 font-mono text-xs sm:text-sm text-white overflow-hidden">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                </div>
                <button
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition-all touch-target flex-shrink-0"
                  title={visibleKeys.has(apiKey.id) ? 'Hide' : 'Show'}
                >
                  {visibleKeys.has(apiKey.id) ? (
                    <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => copyKey(apiKey.key)}
                  className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition-all touch-target flex-shrink-0"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => testApiKey(apiKey.key)}
                  className="p-1.5 sm:p-2 hover:bg-blue-500/20 rounded-lg transition-all touch-target flex-shrink-0"
                  title="Test"
                >
                  <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-all touch-target flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </button>
              </div>

              <div className="mt-3 p-2.5 sm:p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400 font-medium">Quick Start:</p>
                    <InfoTooltip
                      type="info"
                      title="How to Use"
                      description="Copy the code example for your preferred language. Replace the API endpoint with your desired action. All requests must include the Authorization header with your API key."
                    />
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {['curl', 'js', 'python', 'php', 'go'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang({...selectedLang, [apiKey.id]: lang})}
                        className={`px-2 py-1 text-xs rounded transition-all whitespace-nowrap touch-target ${
                          (selectedLang[apiKey.id] || 'curl') === lang
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {lang === 'js' ? 'JS' : lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <code className="flex-1 text-xs text-emerald-400 bg-slate-900/50 px-2 py-1.5 rounded overflow-x-auto break-all">
                    {(selectedLang[apiKey.id] || 'curl') === 'curl' && `curl -H "Authorization: Bearer ${apiKey.key}" https://api.cryptoaml.com/wallets`}
                    {(selectedLang[apiKey.id] || 'curl') === 'js' && `fetch('https://api.cryptoaml.com/wallets', { headers: { 'Authorization': 'Bearer ${apiKey.key}' } })`}
                    {(selectedLang[apiKey.id] || 'curl') === 'python' && `requests.get('https://api.cryptoaml.com/wallets', headers={'Authorization': 'Bearer ${apiKey.key}'})`}
                    {(selectedLang[apiKey.id] || 'curl') === 'php' && `$ch = curl_init('https://api.cryptoaml.com/wallets'); curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ${apiKey.key}']);`}
                    {(selectedLang[apiKey.id] || 'curl') === 'go' && `req.Header.Set("Authorization", "Bearer ${apiKey.key}")`}
                  </code>
                  <button
                    onClick={() => {
                      const lang = selectedLang[apiKey.id] || 'curl';
                      const examples = {
                        curl: `curl -H "Authorization: Bearer ${apiKey.key}" https://api.cryptoaml.com/wallets`,
                        js: `fetch('https://api.cryptoaml.com/wallets', { headers: { 'Authorization': 'Bearer ${apiKey.key}' } })`,
                        python: `requests.get('https://api.cryptoaml.com/wallets', headers={'Authorization': 'Bearer ${apiKey.key}'})`,
                        php: `$ch = curl_init('https://api.cryptoaml.com/wallets');\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ${apiKey.key}']);`,
                        go: `req, _ := http.NewRequest("GET", "https://api.cryptoaml.com/wallets", nil)\nreq.Header.Set("Authorization", "Bearer ${apiKey.key}")`
                      };
                      copyKey(examples[lang as keyof typeof examples]);
                    }}
                    className="p-1.5 hover:bg-emerald-500/20 rounded transition-all flex-shrink-0 touch-target"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Generate New API Key</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-blue-400 mb-1">Security Best Practices</p>
                    <ul className="text-xs text-blue-300/80 space-y-1">
                      <li>• Never share your API keys publicly</li>
                      <li>• Use environment variables in production</li>
                      <li>• Rotate keys regularly for security</li>
                      <li>• Delete unused keys immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && generateKey()}
                />
              </div>
              <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-1">Important</p>
                    <p className="text-xs text-amber-300/80">
                      Save your key immediately after generation. For security reasons, you won't be able to see the full key again. If lost, you'll need to generate a new one.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={generateKey}
                  className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm sm:text-base touch-target"
                >
                  Generate Key
                </button>
                <button
                  onClick={() => {
                    setShowNewKeyModal(false);
                    setNewKeyName('');
                  }}
                  className="flex-1 py-2.5 sm:py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all text-sm sm:text-base touch-target"
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
