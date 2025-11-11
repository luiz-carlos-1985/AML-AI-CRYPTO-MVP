import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Zap, Eye, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuantumSecurity() {
  const { t } = useTranslation();
  const [quantumStatus, setQuantumStatus] = useState({
    encryption: 'ACTIVE',
    keyRotation: 'ROTATING',
    threatLevel: 'MINIMAL',
    lastRotation: new Date().toISOString()
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/50 rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Shield className="w-8 h-8 text-purple-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t('security.quantumSecurity')}</h3>
          <p className="text-purple-400 text-sm">{t('security.quantumReady')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
          <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-white">AES-256-GCM</div>
          <div className="text-xs text-purple-300">{t('security.quantumResistant') || 'Quantum Resistant'}</div>
        </div>
        
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-center">
          <Cpu className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-white">CRYSTALS-Kyber</div>
          <div className="text-xs text-indigo-300">{t('security.keyExchange') || 'Key Exchange'}</div>
        </div>
        
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
          <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-white">FALCON-512</div>
          <div className="text-xs text-cyan-300">{t('security.digitalSignature') || 'Digital Signature'}</div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
          <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-white">Zero-Knowledge</div>
          <div className="text-xs text-emerald-300">{t('security.privacyProofs') || 'Privacy Proofs'}</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-300">Quantum Threat Level:</span>
          <span className="text-emerald-400 font-bold">MINIMAL</span>
        </div>
      </div>
    </motion.div>
  );
}