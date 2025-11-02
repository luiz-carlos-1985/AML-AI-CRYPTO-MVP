import { useState, useEffect } from 'react';
import { Shield, Lock, Key } from 'lucide-react';
import axios from 'axios';
import TwoFactorSetup from '../components/TwoFactorSetup';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/2fa/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTwoFactorEnabled(response.data.enabled);
    } catch (error) {
      console.error('Failed to fetch 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const token = prompt('Enter your 2FA code to disable:');
    if (!token) return;

    try {
      await axios.post('/api/2fa/disable', { token }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTwoFactorEnabled(false);
      alert('2FA disabled successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to disable 2FA');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and authentication</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Add an extra layer of security to your account with 2FA
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    twoFactorEnabled 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {!loading && (
                twoFactorEnabled ? (
                  <button
                    onClick={handleDisable2FA}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSetup(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Enable
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Password</h3>
              <p className="text-gray-600 text-sm mb-3">
                Change your password regularly to keep your account secure
              </p>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">API Keys</h3>
              <p className="text-gray-600 text-sm mb-3">
                Manage API keys for programmatic access to your account
              </p>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Manage API Keys
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSetup && (
        <TwoFactorSetup
          onClose={() => setShowSetup(false)}
          onSuccess={() => {
            setShowSetup(false);
            setTwoFactorEnabled(true);
            alert('2FA enabled successfully!');
          }}
        />
      )}
    </div>
  );
};

export default SecuritySettings;
