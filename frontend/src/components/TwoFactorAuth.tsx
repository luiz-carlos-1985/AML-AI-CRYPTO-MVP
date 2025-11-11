import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import QRCodeWrapper from './QRCodeWrapper';

interface TwoFactorAuthProps {
  onStatusChange?: (enabled: boolean) => void;
}

export default function TwoFactorAuth({ onStatusChange }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await api.get('/2fa/status');
      setIsEnabled(response.data.enabled);
      onStatusChange?.(response.data.enabled);
    } catch (error: any) {
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        console.error('Failed to check 2FA status');
      }
    }
  };

  const setup2FA = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      const mockQrCode = `otpauth://totp/CryptoAML:user@example.com?secret=${mockSecret}&issuer=CryptoAML`;
      
      setSecret(mockSecret);
      setQrCode(mockQrCode);
      setShowSetup(true);
    } catch (error: any) {
      toast.error('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await api.post('/2fa/verify', { token: verificationCode });
      toast.success('2FA enabled successfully!');
      setIsEnabled(true);
      setShowSetup(false);
      setVerificationCode('');
      onStatusChange?.(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await api.post('/2fa/disable', { token: verificationCode });
      toast.success('2FA disabled successfully');
      setIsEnabled(false);
      setShowDisable(false);
      setVerificationCode('');
      onStatusChange?.(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isEnabled ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
            <Shield className={`w-5 h-5 ${isEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm sm:text-base">Two-Factor Authentication</p>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEnabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          <span className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
            isEnabled 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-700/50 text-slate-400'
          }`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          
          {!isEnabled ? (
            <button
              onClick={setup2FA}
              disabled={loading}
              className="px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all disabled:opacity-50 text-sm touch-target"
            >
              {loading ? 'Setting up...' : 'Enable'}
            </button>
          ) : (
            <button
              onClick={() => setShowDisable(true)}
              className="px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm touch-target"
            >
              Disable
            </button>
          )}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 sm:p-6 max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 my-4 sm:my-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-emerald-500/20 rounded-full mb-4">
                <Smartphone className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Setup Two-Factor Authentication</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-4 sm:p-6 bg-white rounded-xl mb-4">
              {qrCode && qrCode.length > 10 ? (
                <QRCodeWrapper value={qrCode} size={180} level="M" />
              ) : (
                <div className="w-[180px] h-[180px] bg-slate-200 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Loading QR Code...</p>
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-400 mb-2">Manual Entry Key</p>
              <p className="text-sm text-white font-mono break-all">{secret}</p>
            </div>

            {/* Verification */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter 6-digit code from your app
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={verify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 text-sm sm:text-base touch-target"
                >
                  {loading ? 'Verifying...' : 'Enable 2FA'}
                </button>
                <button
                  onClick={() => {
                    setShowSetup(false);
                    setVerificationCode('');
                  }}
                  className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all text-sm sm:text-base touch-target"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable Modal */}
      {showDisable && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 sm:p-6 max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 my-4 sm:my-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-red-500/20 rounded-full mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Disable Two-Factor Authentication</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Enter your current 2FA code to disable two-factor authentication
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter 6-digit code from your app
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-center text-base sm:text-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={disable2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 text-sm sm:text-base touch-target"
                >
                  {loading ? 'Disabling...' : 'Disable 2FA'}
                </button>
                <button
                  onClick={() => {
                    setShowDisable(false);
                    setVerificationCode('');
                  }}
                  className="w-full py-2.5 sm:py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all text-sm sm:text-base touch-target"
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
}