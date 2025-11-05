import { motion } from 'framer-motion';
import { Brain, Zap, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import CountUp from 'react-countup';

export default function AIRiskAnalysis() {
  const insights = [
    {
      icon: Brain,
      title: 'AI Pattern Detection',
      value: 127,
      label: 'Suspicious patterns detected',
      color: 'purple',
      trend: '+12%'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      value: 99.8,
      label: 'Accuracy rate',
      color: 'blue',
      trend: '+0.3%'
    },
    {
      icon: Shield,
      title: 'Threat Prevention',
      value: 45,
      label: 'Threats blocked today',
      color: 'emerald',
      trend: '+8%'
    },
    {
      icon: TrendingUp,
      title: 'Risk Score',
      value: 23,
      label: 'Average risk level',
      color: 'amber',
      trend: '-5%'
    }
  ];

  const aiRecommendations = [
    {
      priority: 'high',
      title: 'Unusual Transaction Pattern',
      description: 'Wallet 0x742d...3f8a shows irregular activity patterns',
      action: 'Review immediately',
      confidence: 94
    },
    {
      priority: 'medium',
      title: 'Geographic Risk Alert',
      description: 'Increased transactions from high-risk jurisdictions',
      action: 'Monitor closely',
      confidence: 87
    },
    {
      priority: 'low',
      title: 'Velocity Check',
      description: 'Transaction frequency within normal parameters',
      action: 'No action needed',
      confidence: 76
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">AI Risk Analysis</h2>
          <p className="text-xs sm:text-sm text-slate-400">Machine learning powered insights</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-${insight.color}-500/10 to-${insight.color}-600/5 border border-${insight.color}-500/20 rounded-2xl p-3 sm:p-4`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${insight.color}-400`} />
                <span className="text-xs font-medium text-emerald-400">{insight.trend}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                <CountUp end={insight.value} decimals={insight.value % 1 !== 0 ? 1 : 0} duration={2} />
                {insight.title === 'Real-time Analysis' && '%'}
              </div>
              <p className="text-xs text-slate-400">{insight.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">AI Recommendations</h3>
        </div>

        <div className="space-y-3">
          {aiRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 sm:p-4 rounded-xl border ${
                rec.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                rec.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-slate-700/30 border-slate-600/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      rec.priority === 'high' ? 'bg-red-500 text-white' :
                      rec.priority === 'medium' ? 'bg-amber-500 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {rec.priority}
                    </span>
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Confidence: {rec.confidence}%</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                      {rec.action} →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">AI Model Performance</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              Our machine learning models are continuously trained on millions of transactions to detect sophisticated money laundering patterns with industry-leading accuracy.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-400">99.8%</div>
                <div className="text-xs text-slate-400">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">2.3M</div>
                <div className="text-xs text-slate-400">Patterns Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">24/7</div>
                <div className="text-xs text-slate-400">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
