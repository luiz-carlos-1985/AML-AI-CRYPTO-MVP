import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { date: 'Jan', transactions: 45, alerts: 12, riskScore: 35 },
  { date: 'Feb', transactions: 52, alerts: 8, riskScore: 28 },
  { date: 'Mar', transactions: 61, alerts: 15, riskScore: 42 },
  { date: 'Apr', transactions: 58, alerts: 10, riskScore: 31 },
  { date: 'May', transactions: 70, alerts: 18, riskScore: 48 },
  { date: 'Jun', transactions: 65, alerts: 14, riskScore: 38 },
];

export default function AdvancedCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Transaction Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Transaction Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
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
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorTx)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Alert Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Alert Analysis</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="alerts" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Score Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:col-span-2"
      >
        <h3 className="text-lg font-bold text-white mb-4">Risk Score Evolution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="riskScore" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
