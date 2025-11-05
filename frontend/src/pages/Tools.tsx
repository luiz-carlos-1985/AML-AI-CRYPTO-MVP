import { motion } from 'framer-motion';
import SmartAlerts from '../components/SmartAlerts';
import BlockchainExplorer from '../components/BlockchainExplorer';
import RiskScoring from '../components/RiskScoring';

export default function Tools() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Advanced Tools</h1>
        <p className="text-sm sm:text-base text-slate-400">Professional compliance and investigation tools</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SmartAlerts />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BlockchainExplorer />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RiskScoring />
      </motion.div>
    </div>
  );
}
