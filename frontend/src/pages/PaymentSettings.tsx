import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, Bitcoin, Smartphone, CreditCard, DollarSign, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    pix: { enabled: true, key: '', name: '', bank: '' },
    bitcoin: { enabled: true, address: '', network: 'BTC' },
    ethereum: { enabled: true, address: '', network: 'ERC20' },
    usdt: { enabled: true, address: '', network: 'ERC20' },
    stripe: { enabled: false, publicKey: '', secretKey: '' },
    paypal: { enabled: false, clientId: '', clientSecret: '' }
  });
  
  const [showSecrets, setShowSecrets] = useState({
    stripe: false,
    paypal: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get('/admin/payment-settings');
      if (data) setSettings(data);
    } catch (error) {
      console.error('Failed to load payment settings');
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/admin/payment-settings', settings);
      toast.success('Payment settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save payment settings');
    }
  };

  const validateAddress = (address: string, type: string) => {
    if (!address) return false;
    if (type === 'bitcoin' && address.length >= 26 && address.length <= 62) return true;
    if (type === 'ethereum' && address.startsWith('0x') && address.length === 42) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Payment Settings</h1>
        <p className="text-slate-400 mt-1">Configure where you'll receive payments from customers</p>
      </div>

      {/* PIX Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">PIX (Brazil)</h3>
              <p className="text-sm text-slate-400">Instant payment method</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pix.enabled}
              onChange={(e) => setSettings({ ...settings, pix: { ...settings.pix, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.pix.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">PIX Key</label>
              <input
                type="text"
                value={settings.pix.key}
                onChange={(e) => setSettings({ ...settings, pix: { ...settings.pix, key: e.target.value }})}
                placeholder="email@example.com or phone or CPF/CNPJ"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={settings.pix.name}
                  onChange={(e) => setSettings({ ...settings, pix: { ...settings.pix, name: e.target.value }})}
                  placeholder="Your Company Name"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bank</label>
                <input
                  type="text"
                  value={settings.pix.bank}
                  onChange={(e) => setSettings({ ...settings, pix: { ...settings.pix, bank: e.target.value }})}
                  placeholder="Bank Name"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bitcoin Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Bitcoin className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Bitcoin (BTC)</h3>
              <p className="text-sm text-slate-400">Cryptocurrency payment</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.bitcoin.enabled}
              onChange={(e) => setSettings({ ...settings, bitcoin: { ...settings.bitcoin, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.bitcoin.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bitcoin Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.bitcoin.address}
                  onChange={(e) => setSettings({ ...settings, bitcoin: { ...settings.bitcoin, address: e.target.value }})}
                  placeholder="bc1q..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                {validateAddress(settings.bitcoin.address, 'bitcoin') && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Enter your Bitcoin wallet address (SegWit or Legacy)</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Ethereum Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Ethereum (ETH)</h3>
              <p className="text-sm text-slate-400">Smart contract platform</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ethereum.enabled}
              onChange={(e) => setSettings({ ...settings, ethereum: { ...settings.ethereum, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.ethereum.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ethereum Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.ethereum.address}
                  onChange={(e) => setSettings({ ...settings, ethereum: { ...settings.ethereum, address: e.target.value }})}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                {validateAddress(settings.ethereum.address, 'ethereum') && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Enter your Ethereum wallet address (ERC20)</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* USDT Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">USDT (Tether)</h3>
              <p className="text-sm text-slate-400">Stablecoin pegged to USD</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.usdt.enabled}
              onChange={(e) => setSettings({ ...settings, usdt: { ...settings.usdt, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.usdt.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">USDT Address (ERC20)</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.usdt.address}
                  onChange={(e) => setSettings({ ...settings, usdt: { ...settings.usdt, address: e.target.value }})}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                {validateAddress(settings.usdt.address, 'ethereum') && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Same as Ethereum address for ERC20 USDT</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stripe Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Stripe</h3>
              <p className="text-sm text-slate-400">Credit card processing</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.stripe.enabled}
              onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.stripe.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Publishable Key</label>
              <input
                type="text"
                value={settings.stripe.publicKey}
                onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, publicKey: e.target.value }})}
                placeholder="pk_live_..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Secret Key</label>
              <div className="relative">
                <input
                  type={showSecrets.stripe ? 'text' : 'password'}
                  value={settings.stripe.secretKey}
                  onChange={(e) => setSettings({ ...settings, stripe: { ...settings.stripe, secretKey: e.target.value }})}
                  placeholder="sk_live_..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  onClick={() => setShowSecrets({ ...showSecrets, stripe: !showSecrets.stripe })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecrets.stripe ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* PayPal Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">PayPal</h3>
              <p className="text-sm text-slate-400">PayPal payments</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.paypal.enabled}
              onChange={(e) => setSettings({ ...settings, paypal: { ...settings.paypal, enabled: e.target.checked }})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {settings.paypal.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client ID</label>
              <input
                type="text"
                value={settings.paypal.clientId}
                onChange={(e) => setSettings({ ...settings, paypal: { ...settings.paypal, clientId: e.target.value }})}
                placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client Secret</label>
              <div className="relative">
                <input
                  type={showSecrets.paypal ? 'text' : 'password'}
                  value={settings.paypal.clientSecret}
                  onChange={(e) => setSettings({ ...settings, paypal: { ...settings.paypal, clientSecret: e.target.value }})}
                  placeholder="EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHOGtQgjlkaBeo5jTGE7xV3NNr4fkRU"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  onClick={() => setShowSecrets({ ...showSecrets, paypal: !showSecrets.paypal })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecrets.paypal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Warning */}
      <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">Security Notice</p>
            <p className="text-amber-300/80 text-sm mt-1">
              Keep your API keys and wallet addresses secure. Never share them publicly. All sensitive data is encrypted in our database.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Payment Settings
        </button>
      </div>
    </div>
  );
};

export default PaymentSettings;
