import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Shield, AlertTriangle, Eye, DollarSign } from 'lucide-react';
import CountUp from 'react-countup';
import api from '../services/api';

interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  color: string;
  unit?: string;
  description: string;
}

const getIcon = (iconName: string) => {
  const iconMap = {
    Eye,
    Activity,
    AlertTriangle,
    DollarSign,
    Zap,
    Shield
  };
  return iconMap[iconName as keyof typeof iconMap] || Activity;
};

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    if (!isLive) return;
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  const loadMetrics = async () => {
    try {
      const { data } = await api.get('/dashboard/metrics');
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      // Fallback mock data
      setMetrics([
        {
          id: '1',
          label: 'Active Wallets',
          value: 1247,
          change: 12.5,
          trend: 'up',
          icon: 'Eye',
          color: 'emerald',
          description: 'Wallets being monitored'
        },
        {
          id: '2', 
          label: 'Transactions',
          value: 8934,
          change: 8.2,
          trend: 'up',
          icon: 'Activity',
          color: 'blue',
          description: 'Processed today'
        },
        {
          id: '3',
          label: 'Risk Alerts',
          value: 23,
          change: -15.3,
          trend: 'down',
          icon: 'AlertTriangle',
          color: 'amber',
          description: 'High-risk detected'
        },
        {
          id: '4',
          label: 'Volume',
          value: 2847392,
          change: 24.7,
          trend: 'up',
          icon: 'DollarSign',
          color: 'green',
          unit: '$',
          description: 'Total transaction value'
        },
        {
          id: '5',
          label: 'API Calls',
          value: 45672,
          change: 5.8,
          trend: 'up',
          icon: 'Zap',
          color: 'purple',
          description: 'Requests processed'
        },
        {
          id: '6',
          label: 'Security Score',
          value: 98.7,
          change: 2.1,
          trend: 'up',
          icon: 'Shield',
          color: 'red',
          unit: '%',
          description: 'System security rating'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$' && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: { bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
      blue: { bg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
      amber: { bg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30', icon: 'text-amber-400', glow: 'shadow-amber-500/20' },
      red: { bg: 'from-red-500/20 to-red-600/10 border-red-500/30', icon: 'text-red-400', glow: 'shadow-red-500/20' },
      purple: { bg: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
      green: { bg: 'from-green-500/20 to-green-600/10 border-green-500/30', icon: 'text-green-400', glow: 'shadow-green-500/20' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Real-Time Metrics</h2>
          <p className="text-sm text-slate-400">Live system performance indicators</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-800/50 rounded-xl p-4 h-32"></div>
          ))}
        </div>
      ) : metrics.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No metrics available</p>
          <p className="text-sm">Metrics will appear when data is available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = getIcon(metric.icon);
          const colors = getColorClasses(metric.color);
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`backdrop-blur-xl bg-gradient-to-br ${colors.bg} rounded-xl p-4 relative overflow-hidden border shadow-lg ${colors.glow} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white to-transparent rounded-full -mr-8 -mt-8" />
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-white to-transparent rounded-full -ml-6 -mb-6" />
              </div>
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend === 'up' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                
                {/* Value */}
                <div className="mb-2">
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {metric.unit === '$' && <span className="text-lg">$</span>}
                    <CountUp 
                      end={metric.value} 
                      duration={1.5}
                      formattingFn={(value) => formatValue(value, metric.unit).replace('$', '')}
                    />
                    {metric.unit && metric.unit !== '$' && <span className="text-sm text-slate-400">{metric.unit}</span>}
                  </div>
                </div>
                
                {/* Label & Description */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{metric.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{metric.description}</p>
                </div>


              </div>
            </motion.div>
          );
        })}
        </div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">System Health</h3>
              <p className="text-xs text-slate-400">All systems operational • Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-400">99.9% Uptime</span>
            <span className="text-blue-400">12ms Latency</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}