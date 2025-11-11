import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, GitBranch, Target, Brain, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BlockchainForensics() {
  const { t } = useTranslation();
  const [forensicsData, setForensicsData] = useState({
    activeInvestigations: 47,
    clustersIdentified: 12847,
    entityResolution: 98.7,
    graphAnalysisDepth: 15,
    realTimeAlerts: 234
  });

  const forensicsTools = [
    { name: 'Graph Analysis', icon: GitBranch, status: 'active', description: 'Deep transaction graph traversal' },
    { name: 'Entity Clustering', icon: Target, status: 'active', description: 'Address clustering & attribution' },
    { name: 'Pattern Recognition', icon: Brain, status: 'active', description: 'ML-powered behavior analysis' },
    { name: 'Real-time Tracking', icon: Zap, status: 'active', description: 'Live transaction monitoring' },
    { name: 'Cross-chain Analysis', icon: Search, status: 'active', description: '305+ blockchain networks' },
    { name: 'Privacy Coin Analysis', icon: Shield, status: 'active', description: 'Monero, Zcash, Dash analysis' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="w-8 h-8 text-red-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t('security.blockchainForensics')}</h3>
          <p className="text-red-400 text-sm">{t('security.lawEnforcement') || 'Law Enforcement Grade • Chainalysis Compatible'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-400">{forensicsData.activeInvestigations}</div>
          <div className="text-xs text-red-300">Active Cases</div>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-orange-400">{forensicsData.clustersIdentified.toLocaleString()}</div>
          <div className="text-xs text-orange-300">Clusters ID'd</div>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-400">{forensicsData.entityResolution}%</div>
          <div className="text-xs text-amber-300">Entity Resolution</div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-yellow-400">{forensicsData.graphAnalysisDepth}</div>
          <div className="text-xs text-yellow-300">Graph Depth</div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-emerald-400">{forensicsData.realTimeAlerts}</div>
          <div className="text-xs text-emerald-300">Live Alerts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {forensicsTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <div key={index} className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-red-400" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div className="text-sm font-bold text-white mb-1">{tool.name}</div>
              <div className="text-xs text-slate-300">{tool.description}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-bold text-white">🚨 INVESTIGATIVE CAPABILITIES</div>
          <div className="text-xs text-red-300">Certified for Law Enforcement • Court-Admissible Evidence</div>
        </div>
      </div>
    </motion.div>
  );
}