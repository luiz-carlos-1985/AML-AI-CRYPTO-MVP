import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

export default function RiskScoring() {
  const riskFactors = [
    { name: 'Transaction Pattern', score: 15, max: 25, status: 'low', icon: CheckCircle },
    { name: 'Geographic Risk', score: 35, max: 25, status: 'high', icon: AlertTriangle },
    { name: 'Entity Reputation', score: 8, max: 20, status: 'low', icon: CheckCircle },
    { name: 'Transaction Velocity', score: 12, max: 15, status: 'medium', icon: TrendingDown },
    { name: 'Amount Threshold', score: 18, max: 15, status: 'high', icon: AlertTriangle },
  ];

  const totalScore = riskFactors.reduce((sum, f) => sum + f.score, 0);
  const maxScore = riskFactors.reduce((sum, f) => sum + f.max, 0);
  const percentage = (totalScore / maxScore) * 100;

  const getRiskLevel = (pct: number) => {
    if (pct < 30) return { label: 'LOW', color: 'emerald', icon: CheckCircle };
    if (pct < 60) return { label: 'MEDIUM', color: 'amber', icon: TrendingDown };
    if (pct < 80) return { label: 'HIGH', color: 'orange', icon: AlertTriangle };
    return { label: 'CRITICAL', color: 'red', icon: XCircle };
  };

  const riskLevel = getRiskLevel(percentage);
  const RiskIcon = riskLevel.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Risk Scoring Engine</h2>
            <p className="text-xs sm:text-sm text-slate-400">Multi-factor risk assessment</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-${riskLevel.color}-500 to-${riskLevel.color}-600 flex items-center justify-center`}>
              <RiskIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                <CountUp end={percentage} decimals={1} duration={2} />%
              </div>
              <div className={`text-sm font-bold text-${riskLevel.color}-400`}>{riskLevel.label} RISK</div>
            </div>
          </div>
        </div>

        <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r from-${riskLevel.color}-500 to-${riskLevel.color}-600 rounded-full`}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>0%</span>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>100%</span>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">Risk Factors Breakdown</h3>
        <div className="space-y-4">
          {riskFactors.map((factor, index) => {
            const FactorIcon = factor.icon;
            const factorPercentage = (factor.score / factor.max) * 100;
            return (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FactorIcon className={`w-4 h-4 text-${
                      factor.status === 'low' ? 'emerald' :
                      factor.status === 'medium' ? 'amber' : 'red'
                    }-400`} />
                    <span className="text-sm text-white">{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{factor.score}</span>
                    <span className="text-xs text-slate-500">/ {factor.max}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factorPercentage}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r from-${
                      factor.status === 'low' ? 'emerald' :
                      factor.status === 'medium' ? 'amber' : 'red'
                    }-500 to-${
                      factor.status === 'low' ? 'emerald' :
                      factor.status === 'medium' ? 'amber' : 'red'
                    }-600 rounded-full`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
            <CountUp end={totalScore} duration={2} />
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Total Risk Score</div>
        </div>
        <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">5</div>
          <div className="text-xs sm:text-sm text-slate-400">Factors Analyzed</div>
        </div>
        <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
            <CountUp end={maxScore} duration={2} />
          </div>
          <div className="text-xs sm:text-sm text-slate-400">Maximum Score</div>
        </div>
      </div>
    </div>
  );
}
