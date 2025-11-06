import { useEffect, useState } from 'react';
import { Wallet, ArrowLeftRight, Bell, TrendingUp } from 'lucide-react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TransparencyBadge from '../components/TransparencyBadge';
import RealTimeMetrics from '../components/RealTimeMetrics';
import AuditLog from '../components/AuditLog';
import AdvancedCharts from '../components/AdvancedCharts';
import WalletSync from '../components/WalletSync';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const riskData = [
    { name: 'Low', value: stats?.riskDistribution?.LOW || 0, color: '#10b981' },
    { name: 'Medium', value: stats?.riskDistribution?.MEDIUM || 0, color: '#f59e0b' },
    { name: 'High', value: stats?.riskDistribution?.HIGH || 0, color: '#ef4444' },
    { name: 'Critical', value: stats?.riskDistribution?.CRITICAL || 0, color: '#991b1b' },
  ];

  const statCards = [
    { icon: Wallet, label: t('dashboard.totalWallets'), value: stats?.totalWallets || 0, gradient: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', iconGradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/50' },
    { icon: ArrowLeftRight, label: t('dashboard.transactions'), value: stats?.totalTransactions || 0, gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', iconGradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/50' },
    { icon: Bell, label: t('dashboard.unreadAlerts'), value: stats?.unreadAlerts || 0, gradient: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', iconGradient: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/50' },
    { icon: TrendingUp, label: t('dashboard.highRisk'), value: stats?.highRiskTransactions || 0, gradient: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', iconGradient: 'from-red-500 to-red-600', shadow: 'shadow-red-500/50' }
  ];

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white"
      >
        {t('dashboard.title')}
      </motion.h1>

      {/* Real-Time Metrics */}
      <RealTimeMetrics />

      {/* Wallet Sync */}
      <WalletSync />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`backdrop-blur-xl bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center shadow-lg ${card.shadow} animate-pulse-glow`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </motion.div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">{card.label}</dt>
                      <dd className="text-2xl font-bold text-white">
                        <CountUp end={card.value} duration={2} />
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}


      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TransparencyBadge />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-white">{t('dashboard.riskDistribution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-white">{t('dashboard.recentTransactions')}</h2>
          <div className="space-y-3">
            {stats?.recentTransactions?.slice(0, 5).map((tx: any, index: number) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between border-b border-slate-700/50 pb-3 hover:bg-slate-700/30 p-2 rounded-lg transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200 truncate font-mono">{tx.hash.substring(0, 20)}...</p>
                  <p className="text-xs text-slate-400">{tx.wallet.blockchain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{tx.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    tx.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    tx.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    tx.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-red-600/30 text-red-300 border border-red-600/50'
                  }`}>
                    {tx.riskLevel}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>

        {/* Audit Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AuditLog />
        </motion.div>
      </div>

      {/* Advanced Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <AdvancedCharts />
      </motion.div>
    </div>
  );
};

export default Dashboard;
