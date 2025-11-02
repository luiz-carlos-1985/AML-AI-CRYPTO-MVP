import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskExplanation from '../components/RiskExplanation';
import RiskTimeline from '../components/RiskTimeline';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      const { data } = await api.get(`/transactions/${id}`);
      setTransaction(data);
    } catch (error) {
      console.error('Failed to load transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!transaction) return <div className="text-white">Transaction not found</div>;

  // Mock data for demonstration
  const riskFactors = [
    { name: 'Transaction Amount', score: 6.5, weight: 0.25, description: 'Large transaction compared to wallet history', status: 'warning' as const },
    { name: 'Wallet Age', score: 3.2, weight: 0.15, description: 'Wallet created recently', status: 'safe' as const },
    { name: 'Transaction Velocity', score: 8.1, weight: 0.20, description: 'High frequency of transactions detected', status: 'danger' as const },
    { name: 'Counterparty Risk', score: 5.5, weight: 0.25, description: 'Recipient has moderate risk score', status: 'warning' as const },
    { name: 'Geographic Risk', score: 2.8, weight: 0.15, description: 'Low-risk jurisdiction', status: 'safe' as const }
  ];

  const timelineEvents = [
    { date: '2024-01-15 14:30', riskScore: 7.2, riskLevel: 'HIGH', event: 'Transaction initiated', change: 'up' as const },
    { date: '2024-01-15 14:25', riskScore: 5.5, riskLevel: 'MEDIUM', event: 'Wallet activity increased', change: 'up' as const },
    { date: '2024-01-14 10:15', riskScore: 3.2, riskLevel: 'LOW', event: 'Normal activity', change: 'stable' as const },
    { date: '2024-01-13 16:45', riskScore: 2.8, riskLevel: 'LOW', event: 'Wallet verified', change: 'down' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/transactions')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Transactions</span>
        </motion.button>
      </div>

      {/* Transaction Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Transaction Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">Transaction Hash</p>
            <div className="flex items-center space-x-2">
              <p className="text-white font-mono text-sm">{transaction.hash}</p>
              <ExternalLink className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
            </div>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-1">Amount</p>
            <p className="text-white font-semibold text-lg">{transaction.amount}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-1">From</p>
            <p className="text-white font-mono text-sm">{transaction.fromAddress}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-1">To</p>
            <p className="text-white font-mono text-sm">{transaction.toAddress}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-1">Blockchain</p>
            <p className="text-white">{transaction.blockchain}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-400 mb-1">Timestamp</p>
            <p className="text-white">{new Date(transaction.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Explanation */}
      <RiskExplanation
        riskScore={transaction.riskScore}
        riskLevel={transaction.riskLevel}
        factors={riskFactors}
      />

      {/* Risk Timeline */}
      <RiskTimeline events={timelineEvents} />
    </div>
  );
};

export default TransactionDetail;
