import { motion } from 'framer-motion';
import { Brain, Zap, Database, Target, TrendingUp, AlertCircle } from 'lucide-react';

const AIExplainer = () => {
  const steps = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'We analyze transaction patterns, wallet history, blockchain metadata, and counterparty information.',
      metrics: ['1M+ transactions analyzed', '50+ data points per transaction']
    },
    {
      icon: Brain,
      title: 'AI Processing',
      description: 'Our machine learning model processes data using advanced algorithms trained on verified AML cases.',
      metrics: ['99.2% accuracy', 'Real-time analysis']
    },
    {
      icon: Target,
      title: 'Risk Scoring',
      description: 'Each factor is weighted and combined into a comprehensive risk score from 0-10.',
      metrics: ['5 risk categories', 'Explainable results']
    },
    {
      icon: AlertCircle,
      title: 'Alert Generation',
      description: 'High-risk transactions trigger automatic alerts with detailed explanations and recommended actions.',
      metrics: ['Instant notifications', 'Actionable insights']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-4 md:p-8 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-pulse-glow">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">How Our AI Works</h2>
          <p className="text-sm text-slate-400">Complete transparency in every step</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:border-purple-500/30 transition-all group"
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                {index + 1}
              </div>
              
              <Icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">{step.description}</p>
              
              <div className="space-y-2">
                {step.metrics.map((metric, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-slate-400">{metric}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-1">Continuous Improvement</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI model is continuously updated with new patterns and regulatory requirements. 
              Every decision is logged and can be audited for compliance purposes.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIExplainer;
