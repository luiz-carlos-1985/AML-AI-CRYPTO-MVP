import { motion } from 'framer-motion';
import { Shield, CheckCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AIRiskAnalysis from '../components/AIRiskAnalysis';
import RiskHeatmap from '../components/RiskHeatmap';
import AdvancedCharts from '../components/AdvancedCharts';
import ComplianceReports from '../components/ComplianceReports';

export default function Analytics() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* COMPLIANCE PREMIUM HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/50 rounded-xl p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Advanced Analytics</h1>
              <p className="text-purple-400 text-xs sm:text-sm font-medium">🤖 IA 99.8% Precisão - Certificado ISO 27001 + SOC 2</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">ML Certificado</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AIRiskAnalysis />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RiskHeatmap />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Stats</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs sm:text-sm text-slate-400">Total Volume (24h)</span>
              <span className="text-base sm:text-lg font-bold text-white">$2.4M</span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs sm:text-sm text-slate-400">Avg Transaction Size</span>
              <span className="text-base sm:text-lg font-bold text-white">$8,450</span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs sm:text-sm text-slate-400">High Risk Ratio</span>
              <span className="text-base sm:text-lg font-bold text-red-400">3.2%</span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <span className="text-xs sm:text-sm text-emerald-300">Compliance Score</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-base sm:text-lg font-bold text-emerald-400">99.8%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AdvancedCharts />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ComplianceReports />
      </motion.div>
    </div>
  );
}
