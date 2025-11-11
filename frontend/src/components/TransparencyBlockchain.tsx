import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { revolutionaryApi, TransparencyRecord } from '../services/revolutionaryApi';
import { useTranslation } from 'react-i18next';

const TransparencyBlockchain: React.FC = () => {
  const { t } = useTranslation();
  const [auditTrail, setAuditTrail] = useState<TransparencyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockchainStats, setBlockchainStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    entityId: ''
  });

  useEffect(() => {
    loadAuditTrail();
  }, []);

  const loadAuditTrail = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.startDate) params.startDate = new Date(filters.startDate).getTime();
      if (filters.endDate) params.endDate = new Date(filters.endDate).getTime();
      if (filters.entityId) params.entityId = filters.entityId;

      const response = await revolutionaryApi.getTransparencyAuditTrail(params);
      setAuditTrail(response.auditTrail);
      setBlockchainStats(response.blockchainStats);
    } catch (error) {
      console.error('Error loading audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await revolutionaryApi.exportTransparencyReport();
      // Create download link
      const link = document.createElement('a');
      link.href = response.downloadUrl;
      link.download = `transparency-report-${Date.now()}.json`;
      link.click();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
            🔗
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transparency Blockchain</h2>
            <p className="text-blue-200">Immutable audit trail with public verification</p>
          </div>
        </div>
        <button
          onClick={exportReport}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          📤 Export Report
        </button>
      </div>

      {/* Blockchain Stats */}
      {blockchainStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{blockchainStats.totalBlocks}</div>
            <div className="text-blue-200 text-sm">Total Blocks</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{blockchainStats.pendingRecords}</div>
            <div className="text-blue-200 text-sm">Pending Records</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${blockchainStats.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {blockchainStats.isValid ? '✅' : '❌'}
            </div>
            <div className="text-blue-200 text-sm">Chain Valid</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{blockchainStats.difficulty}</div>
            <div className="text-blue-200 text-sm">Difficulty</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-white/70 text-sm mb-2">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={loadAuditTrail}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            {loading ? 'Loading...' : '🔍 Filter Records'}
          </button>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {auditTrail.map((record, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-400"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  🔗
                </div>
                <div>
                  <div className="text-white font-semibold">{record.action}</div>
                  <div className="text-blue-200 text-sm">{formatTimestamp(record.timestamp)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={record.publicVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-all"
                >
                  🔍 Verify
                </a>
                <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  ✅ Valid
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Block Hash:</span>
                <div className="text-blue-300 font-mono text-xs break-all">{record.blockHash}</div>
              </div>
              <div>
                <span className="text-white/70">Compliance Proof:</span>
                <div className="text-green-300 font-mono text-xs break-all">{record.complianceProof}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {auditTrail.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔗</div>
          <div className="text-white/70">No audit records found</div>
          <div className="text-blue-200 text-sm">Try adjusting your filters or check back later</div>
        </div>
      )}
    </div>
  );
};

export default TransparencyBlockchain;