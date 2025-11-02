import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      const params = filter ? { riskLevel: filter } : {};
      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        >
          <option value="">All Risk Levels</option>
          <option value="LOW">Low Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="CRITICAL">Critical Risk</option>
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                <div className="text-sm font-mono text-white bg-slate-900/50 px-2 py-1 rounded inline-block break-all">
                  {tx.hash.substring(0, 16)}...
                </div>
              </div>
              <span className={`ml-2 px-2 py-1 text-xs rounded-lg font-medium whitespace-nowrap ${
                tx.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                tx.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                tx.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-red-600/30 text-red-300 border border-red-600/50'
              }`}>
                {tx.riskLevel}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Blockchain</div>
                <span className="px-2 py-1 text-xs rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 font-medium inline-block">
                  {tx.blockchain}
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Amount</div>
                <div className="text-sm text-white font-medium">{tx.amount}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div className="text-xs text-slate-400">
                {tx.wallet.label || tx.wallet.address.substring(0, 10)}...
              </div>
              <div className="text-xs text-slate-400">
                {format(new Date(tx.timestamp), 'MMM dd, HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 shadow-2xl overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/30 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-white bg-slate-900/50 px-2 py-1 rounded inline-block">
                      {tx.hash.substring(0, 20)}...
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {tx.wallet.label || tx.wallet.address.substring(0, 10)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 font-medium">
                      {tx.blockchain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-lg font-medium ${
                      tx.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      tx.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      tx.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-red-600/30 text-red-300 border border-red-600/50'
                    }`}>
                      {tx.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
