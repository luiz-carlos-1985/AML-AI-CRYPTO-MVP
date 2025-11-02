import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  status: 'safe' | 'warning' | 'danger';
}

interface RiskExplanationProps {
  riskScore: number;
  riskLevel: string;
  factors: RiskFactor[];
}

const RiskExplanation = ({ riskScore, riskLevel, factors }: RiskExplanationProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400';
      case 'MEDIUM': return 'text-amber-400';
      case 'HIGH': return 'text-red-400';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'danger': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Risk Analysis Explanation</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Risk Score</p>
          <p className={`text-3xl font-bold ${getRiskColor(riskLevel)}`}>{riskScore.toFixed(1)}</p>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mb-4 md:mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold ${
          riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
          riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-red-600/30 text-red-300 border border-red-600/50'
        }`}>
          {riskLevel} RISK
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This risk assessment is calculated using multiple factors including transaction patterns, 
              wallet history, and blockchain analysis. Each factor is weighted based on its importance 
              in detecting potential money laundering activities.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-3 md:space-y-4">
        <h4 className="text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wider">Risk Factors Breakdown</h4>
        {factors.map((factor, index) => (
          <motion.div
            key={factor.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 md:p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(factor.status)}
                <div>
                  <p className="font-semibold text-white">{factor.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{factor.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Score</p>
                <p className="text-lg font-bold text-white">{factor.score.toFixed(1)}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Weight: {(factor.weight * 100).toFixed(0)}%</span>
                <span>Impact: {(factor.score * factor.weight).toFixed(1)}</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score * 10}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    factor.status === 'safe' ? 'bg-emerald-500' :
                    factor.status === 'warning' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Methodology */}
      <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Our Methodology
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          We use advanced machine learning algorithms trained on millions of transactions to identify 
          suspicious patterns. Our system analyzes transaction velocity, amounts, wallet age, 
          counterparty risk, and blockchain-specific indicators. All assessments are explainable 
          and comply with international AML regulations.
        </p>
      </div>
    </motion.div>
  );
};

export default RiskExplanation;
