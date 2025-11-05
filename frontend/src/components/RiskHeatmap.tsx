import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const heatmapData = [
  { country: 'United States', risk: 15, transactions: 1250, color: 'emerald' },
  { country: 'United Kingdom', risk: 12, transactions: 890, color: 'emerald' },
  { country: 'Germany', risk: 10, transactions: 650, color: 'emerald' },
  { country: 'Russia', risk: 75, transactions: 120, color: 'red' },
  { country: 'China', risk: 45, transactions: 340, color: 'orange' },
  { country: 'Brazil', risk: 35, transactions: 280, color: 'amber' },
  { country: 'India', risk: 28, transactions: 420, color: 'amber' },
  { country: 'Japan', risk: 8, transactions: 580, color: 'emerald' },
];

export default function RiskHeatmap() {
  return (
    <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Geographic Risk Heatmap</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Transaction risk by country</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm text-slate-400">Live Data</span>
        </div>
      </div>

      <div className="space-y-3">
        {heatmapData.map((item, index) => {
          const getRiskColor = (risk: number) => {
            if (risk < 20) return 'emerald';
            if (risk < 40) return 'amber';
            if (risk < 60) return 'orange';
            return 'red';
          };

          const color = getRiskColor(item.risk);

          return (
            <motion.div
              key={item.country}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-white">{item.country}</span>
                  {item.risk > 50 && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs text-slate-400">{item.transactions} txs</span>
                  <span className={`text-xs sm:text-sm font-bold text-${color}-400`}>{item.risk}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.risk}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Low Risk (0-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">Medium (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-slate-400">High (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">Critical (60%+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
