import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const RiskEducation = () => {
  const [activeTab, setActiveTab] = useState('factors');

  const riskFactors = [
    {
      name: 'Transaction Amount',
      weight: '25%',
      description: 'Large or unusual transaction amounts compared to wallet history',
      examples: ['Sudden large transfers', 'Amounts above typical patterns', 'Round number transactions']
    },
    {
      name: 'Transaction Velocity',
      weight: '20%',
      description: 'Frequency and speed of transactions within a time period',
      examples: ['Multiple rapid transactions', 'Burst activity patterns', 'Unusual timing']
    },
    {
      name: 'Counterparty Risk',
      weight: '25%',
      description: 'Risk profile of the receiving or sending wallet',
      examples: ['Known high-risk wallets', 'Sanctioned addresses', 'Mixer services']
    },
    {
      name: 'Wallet Age & History',
      weight: '15%',
      description: 'Age of wallet and historical transaction patterns',
      examples: ['Newly created wallets', 'Dormant wallet activation', 'Inconsistent patterns']
    },
    {
      name: 'Geographic Risk',
      weight: '15%',
      description: 'Jurisdiction and geographic location indicators',
      examples: ['High-risk countries', 'Sanctioned regions', 'Tax havens']
    }
  ];

  const riskLevels = [
    {
      level: 'LOW',
      range: '0.0 - 3.0',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      description: 'Normal activity with no suspicious indicators',
      action: 'No action required - Continue monitoring'
    },
    {
      level: 'MEDIUM',
      range: '3.1 - 6.0',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      description: 'Some unusual patterns detected that warrant attention',
      action: 'Enhanced monitoring - Review transaction details'
    },
    {
      level: 'HIGH',
      range: '6.1 - 8.5',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      description: 'Multiple risk factors present, potential AML concern',
      action: 'Immediate review required - Consider filing SAR'
    },
    {
      level: 'CRITICAL',
      range: '8.6 - 10.0',
      color: 'text-red-600',
      bgColor: 'bg-red-600/30',
      borderColor: 'border-red-600/50',
      description: 'Severe risk indicators, likely money laundering activity',
      action: 'Urgent action - File SAR and consider blocking'
    }
  ];

  const faqs = [
    {
      q: 'How accurate is the risk scoring?',
      a: 'Our AI model achieves 99.2% accuracy based on validation against known AML cases. The model is continuously updated with new patterns and regulatory requirements.'
    },
    {
      q: 'Can I customize risk thresholds?',
      a: 'Yes, enterprise plans allow customization of risk thresholds and weights based on your specific compliance requirements and risk appetite.'
    },
    {
      q: 'How often is the model updated?',
      a: 'Our AI model is retrained weekly with new data and updated monthly with new regulatory patterns. Critical updates are deployed immediately.'
    },
    {
      q: 'What happens to false positives?',
      a: 'All flagged transactions can be reviewed and marked as false positives. This feedback improves the model and reduces future false positives.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 md:p-8 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Assessment Guide</h2>
          <p className="text-sm text-slate-400">Understanding how we evaluate risk</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/50 pb-2">
        {[
          { id: 'factors', label: 'Risk Factors', icon: Lightbulb },
          { id: 'levels', label: 'Risk Levels', icon: AlertTriangle },
          { id: 'faq', label: 'FAQ', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg md:rounded-t-lg transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'factors' && (
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{factor.name}</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                    Weight: {factor.weight}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{factor.description}</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-semibold">Examples:</p>
                  {factor.examples.map((example, i) => (
                    <p key={i} className="text-xs text-slate-400 pl-4">• {example}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="space-y-4">
            {riskLevels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 ${level.bgColor} border ${level.borderColor} rounded-xl`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-xl font-bold ${level.color}`}>{level.level} RISK</h3>
                    <p className="text-sm text-slate-400 mt-1">Score Range: {level.range}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">{level.description}</p>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Recommended Action:</p>
                  <p className="text-sm text-white">{level.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30"
              >
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RiskEducation;
