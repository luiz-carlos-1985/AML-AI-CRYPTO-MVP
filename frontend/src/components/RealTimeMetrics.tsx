import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import CountUp from 'react-countup';

interface Metric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Active Monitoring', value: 0, change: 0, trend: 'up', icon: Activity, color: 'emerald' },
    { label: 'Transactions/Hour', value: 0, change: 0, trend: 'up', icon: Zap, color: 'blue' },
    { label: 'Risk Score Avg', value: 0, change: 0, trend: 'down', icon: TrendingDown, color: 'amber' },
    { label: 'Alerts Today', value: 0, change: 0, trend: 'up', icon: TrendingUp, color: 'red' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: m.value + Math.floor(Math.random() * 10),
        change: (Math.random() * 20 - 10).toFixed(1) as any,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`backdrop-blur-xl bg-gradient-to-br from-${metric.color}-500/10 to-${metric.color}-600/5 border border-${metric.color}-500/20 rounded-2xl p-4 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              
              <div className="text-2xl font-bold text-white mb-1">
                <CountUp end={metric.value} duration={1} />
              </div>
              
              <div className="text-xs text-slate-400">{metric.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
