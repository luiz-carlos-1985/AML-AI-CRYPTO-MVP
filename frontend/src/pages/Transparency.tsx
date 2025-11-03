import { motion } from 'framer-motion';
import AIExplainer from '../components/AIExplainer';
import ComplianceInfo from '../components/ComplianceInfo';
import RiskEducation from '../components/RiskEducation';
import TransparencyBadge from '../components/TransparencyBadge';

const Transparency = () => {

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Transparency Center</h1>
        <p className="text-slate-400 text-base md:text-lg">
          Complete visibility into how we protect your business
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <TransparencyBadge />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 md:p-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Our Commitment</h2>
            <div className="space-y-4 text-slate-300">
              <p className="leading-relaxed">
                At CryptoAML, we believe transparency builds trust. Every risk assessment, 
                every alert, and every decision made by our system is fully explainable and auditable.
              </p>
              <p className="leading-relaxed">
                We don't use "black box" AI. Instead, we provide detailed breakdowns of how 
                each risk score is calculated, what factors contributed to it, and why certain 
                thresholds were triggered.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-400">99.2%</p>
                  <p className="text-xs text-slate-400 mt-1">Accuracy Rate</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-400">100%</p>
                  <p className="text-xs text-slate-400 mt-1">Explainable</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-400">24/7</p>
                  <p className="text-xs text-slate-400 mt-1">Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AIExplainer />
      <ComplianceInfo />
      <RiskEducation />
    </div>
  );
};

export default Transparency;
