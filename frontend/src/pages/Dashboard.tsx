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
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Wallets</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats?.totalWallets || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowLeftRight className="h-6 w-6 text-secondary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats?.totalTransactions || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unread Alerts</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats?.unreadAlerts || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-danger" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Risk</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats?.highRiskTransactions || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
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

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {stats?.recentTransactions?.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.hash.substring(0, 20)}...</p>
                  <p className="text-xs text-gray-500">{tx.wallet.blockchain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{tx.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tx.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                    tx.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    tx.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                    'bg-red-900 text-white'
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
