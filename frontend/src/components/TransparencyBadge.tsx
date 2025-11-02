import { motion } from 'framer-motion';
import { Shield, Eye, Lock, CheckCircle } from 'lucide-react';

const TransparencyBadge = () => {
  const features = [
    { icon: Eye, text: 'Explainable AI', color: 'text-blue-400' },
    { icon: Shield, text: 'Compliant', color: 'text-emerald-400' },
    { icon: Lock, text: 'Secure', color: 'text-purple-400' },
    { icon: CheckCircle, text: 'Audited', color: 'text-amber-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Transparency Guarantee</h3>
          <p className="text-xs text-slate-400">Every decision explained</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 p-2 bg-slate-900/30 rounded-lg"
            >
              <Icon className={`w-4 h-4 ${feature.color}`} />
              <span className="text-xs text-slate-300 font-medium">{feature.text}</span>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Our AI-powered system provides full transparency on how risk scores are calculated, 
        ensuring you understand every decision.
      </p>
    </motion.div>
  );
};

export default TransparencyBadge;
