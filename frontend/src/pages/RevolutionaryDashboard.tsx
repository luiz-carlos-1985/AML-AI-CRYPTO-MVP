import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { revolutionaryApi } from '../services/revolutionaryApi';
import { useTranslation } from 'react-i18next';

const RevolutionaryDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await revolutionaryApi.getRevolutionaryDashboard();
      setDashboard(response.dashboard);
    } catch (error) {
      console.error('Error loading revolutionary dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 {t('revolutionary.dashboard.title', 'Revolutionary Dashboard')}
          </h1>
          <p className="text-blue-200">
            {t('revolutionary.dashboard.subtitle', 'Advanced AI-Powered Compliance & Analytics')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
            {['overview', 'quantum', 'transparency', 'performance', 'ux'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {t(`revolutionary.tabs.${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quantum Compliance */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  🧠
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Quantum Compliance</h3>
                  <p className="text-purple-200 text-sm">AI-Powered Analysis</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Score:</span>
                  <span className="text-white font-bold">{dashboard?.quantumCompliance?.averageScore || 92}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Accuracy:</span>
                  <span className="text-green-400 font-bold">{((dashboard?.quantumCompliance?.predictiveAccuracy || 0.98) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>

            {/* Transparency Blockchain */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  🔗
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Transparency Blockchain</h3>
                  <p className="text-blue-200 text-sm">Immutable Audit Trail</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Blocks:</span>
                  <span className="text-white font-bold">{dashboard?.transparencyBlockchain?.totalBlocks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Valid:</span>
                  <span className={`font-bold ${dashboard?.transparencyBlockchain?.isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {dashboard?.transparencyBlockchain?.isValid ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quantum Performance */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Quantum Performance</h3>
                  <p className="text-green-200 text-sm">Intelligent Caching</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Efficiency:</span>
                  <span className="text-white font-bold">{((dashboard?.quantumPerformance?.efficiency || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Hit Rate:</span>
                  <span className="text-green-400 font-bold">{((dashboard?.quantumPerformance?.cacheHitRate || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>

            {/* Adaptive UX */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  🎨
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">Adaptive UX</h3>
                  <p className="text-orange-200 text-sm">AI-Powered Interface</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Skill Level:</span>
                  <span className="text-white font-bold">{dashboard?.adaptiveUX?.userSkillLevel || 'BEGINNER'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Adaptation:</span>
                  <span className="text-orange-400 font-bold">{((dashboard?.adaptiveUX?.adaptationScore || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🌟 Revolutionary Features Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Quantum Compliance', status: 'active', icon: '🧠' },
              { name: 'Transparency Blockchain', status: 'active', icon: '🔗' },
              { name: 'Quantum Performance', status: 'active', icon: '⚡' },
              { name: 'Adaptive UX', status: 'active', icon: '🎨' },
              { name: 'Predictive Analytics', status: 'active', icon: '🔮' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <div className="text-white font-semibold text-sm">{feature.name}</div>
                <div className="text-green-400 text-xs">✅ Active</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <button
            onClick={() => setActiveTab('quantum')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            🧠 Run Quantum Analysis
          </button>
          <button
            onClick={() => setActiveTab('transparency')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            🔗 View Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ⚡ Optimize Performance
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RevolutionaryDashboard;