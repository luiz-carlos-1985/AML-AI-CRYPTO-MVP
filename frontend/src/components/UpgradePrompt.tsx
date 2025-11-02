import { motion } from 'framer-motion';
import { Crown, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  requiredPlan: 'GROWTH' | 'ENTERPRISE';
  onClose: () => void;
}

const UpgradePrompt = ({ feature, requiredPlan, onClose }: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Upgrade Required</h3>
        <p className="text-slate-400 mb-6">
          <strong className="text-white">{feature}</strong> is available on the{' '}
          <strong className="text-emerald-400">{requiredPlan}</strong> plan.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              navigate('/account');
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 flex items-center justify-center"
          >
            Upgrade Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all duration-200"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradePrompt;
