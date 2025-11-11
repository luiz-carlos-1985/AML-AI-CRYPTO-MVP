import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity, Calendar, Filter } from 'lucide-react';
import api from '../services/api';

export default function AdvancedCharts() {
  const [data, setData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('transactions');

  useEffect(() => {
    loadChartData();
  }, [timeframe]);

  const loadChartData = async () => {
    try {
      const [chartResponse, riskResponse] = await Promise.all([
        api.get(`/dashboard/charts?timeframe=${timeframe}`),
        api.get('/dashboard/risk-distribution')
      ]);
      
      setData(chartResponse.data);
      setRiskData(riskResponse.data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
      setData([]);
      setRiskData([]);
    } finally {
      setLoading(false);
    }
  };

  const chartTypes = [
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'risk', label: 'Risk Analysis', icon: BarChart3 },
    { id: 'distribution', label: 'Risk Distribution', icon: PieIcon },
    { id: 'compliance', label: 'Compliance', icon: Activity }
  ];

  const timeframes = [
    { id: '24h', label: '24H' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' }
  ];

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="text-center py-12 text-slate-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No chart data available</p>
          <p className="text-sm">Data will appear when transactions are processed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-sm text-slate-400">Comprehensive data visualization and insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chart Type Selector */}
          <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveChart(type.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeChart === type.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === tf.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">
              {chartTypes.find(c => c.id === activeChart)?.label} Trend
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            {activeChart === 'transactions' && (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTx)" 
                />
              </AreaChart>
            )}

            {activeChart === 'risk' && (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="riskScore" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {activeChart === 'compliance' && (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <PieIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Risk Distribution</h3>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {riskData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-slate-200 block truncate">{entry.name}</span>
                    <span className="text-xs text-slate-400">{entry.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">Key Metrics</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-400">Avg Response Time</span>
                <span className="text-sm font-semibold text-green-400">12ms</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-400">Detection Rate</span>
                <span className="text-sm font-semibold text-blue-400">99.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-400">False Positives</span>
                <span className="text-sm font-semibold text-amber-400">0.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm text-slate-400">System Uptime</span>
                <span className="text-sm font-semibold text-emerald-400">99.99%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}