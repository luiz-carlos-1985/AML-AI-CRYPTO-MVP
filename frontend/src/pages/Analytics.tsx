import { motion } from 'framer-motion';
import AIRiskAnalysis from '../components/AIRiskAnalysis';
import RiskHeatmap from '../components/RiskHeatmap';
import AdvancedCharts from '../components/AdvancedCharts';
import ComplianceReports from '../components/ComplianceReports';

export default function Analytics() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
        <p className="text-sm sm:text-base text-slate-400">AI-powered insights and comprehensive reporting</p>
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
            <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs sm:text-sm text-slate-400">Compliance Score</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">98.7%</span>
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
