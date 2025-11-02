import { useState } from 'react';
import { Shield, X } from 'lucide-react';
import axios from 'axios';

interface TwoFactorSetupProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TwoFactorSetup = ({ onClose, onSuccess }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/2fa/setup', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/2fa/verify', { token }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500">Secure your account</p>
          </div>
        </div>

        {step === 'setup' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enable 2FA to add an extra layer of security to your account. You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            <button
              onClick={handleSetup}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Setup 2FA'}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Scan this QR code with your authenticator app:</p>
              {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto" />}
              <p className="text-xs text-gray-500 mt-3">Or enter this code manually:</p>
              <code className="block text-xs bg-white p-2 rounded mt-1 break-all">{secret}</code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code from your app
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || token.length !== 6}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
