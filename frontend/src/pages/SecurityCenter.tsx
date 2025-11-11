import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QuantumSecurity from '../components/QuantumSecurity';
import BiometricAuth from '../components/BiometricAuth';
import BlockchainForensics from '../components/BlockchainForensics';
import RegulatoryOracle from '../components/RegulatoryOracle';

export default function SecurityCenter() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* HEADER PREMIUM */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-900/30 to-purple-900/30 border border-red-400/50 rounded-xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('security.title')}</h1>
              <p className="text-red-400 text-sm font-medium">🛡️ {t('security.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-bold text-sm">{t('security.defconSecure')}</span>
          </div>
        </div>
      </motion.div>

      {/* SECURITY OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/50 rounded-xl p-4 text-center"
        >
          <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-400">100%</div>
          <div className="text-sm text-emerald-300">{t('security.securityScore')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/50 rounded-xl p-4 text-center"
        >
          <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-400">0</div>
          <div className="text-sm text-blue-300">{t('security.vulnerabilities')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/50 rounded-xl p-4 text-center"
        >
          <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-400">24/7</div>
          <div className="text-sm text-purple-300">{t('security.monitoring')}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/50 rounded-xl p-4 text-center"
        >
          <Zap className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-400">&lt;1ms</div>
          <div className="text-sm text-red-300">{t('security.threatResponse')}</div>
        </motion.div>
      </div>

      {/* SECURITY MODULES */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuantumSecurity />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <BiometricAuth />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <BlockchainForensics />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <RegulatoryOracle />
        </motion.div>
      </div>

      {/* THREAT INTELLIGENCE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-slate-800/70 to-slate-700/70 border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          {t('security.threatIntelligence')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">847</div>
            <div className="text-sm text-amber-300">Threat Feeds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">12.4M</div>
            <div className="text-sm text-red-300">IOCs Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">99.97%</div>
            <div className="text-sm text-emerald-300">Detection Rate</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-white">🚨 ACTIVE THREAT MONITORING</div>
            <div className="text-xs text-red-300">Real-time Global Cyber Threat Intelligence • Nation-State Actor Detection</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}