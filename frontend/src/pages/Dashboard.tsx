import { useEffect, useState } from 'react';
import { Wallet, ArrowLeftRight, Bell, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
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
    return <div className="text-center py-12">Loading...</div>;
  }

  const riskData = [
    { name: 'Low', value: stats?.riskDistribution?.LOW || 0, color: '#10b981' },
    { name: 'Medium', value: stats?.riskDistribution?.MEDIUM || 0, color: '#f59e0b' },
    { name: 'High', value: stats?.riskDistribution?.HIGH || 0, color: '#ef4444' },
    { name: 'Critical', value: stats?.riskDistribution?.CRITICAL || 0, color: '#991b1b' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-400 truncate">Total Wallets</dt>
                  <dd className="text-2xl font-bold text-white">{stats?.totalWallets || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <ArrowLeftRight className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-400 truncate">Transactions</dt>
                  <dd className="text-2xl font-bold text-white">{stats?.totalTransactions || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-400 truncate">Unread Alerts</dt>
                  <dd className="text-2xl font-bold text-white">{stats?.unreadAlerts || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-400 truncate">High Risk</dt>
                  <dd className="text-2xl font-bold text-white">{stats?.highRiskTransactions || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-semibold mb-4 text-white">Risk Distribution</h2>
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
        </div>

        <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h2>
          <div className="space-y-3">
            {stats?.recentTransactions?.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between border-b border-slate-700/50 pb-3 hover:bg-slate-700/30 p-2 rounded-lg transition-all">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
