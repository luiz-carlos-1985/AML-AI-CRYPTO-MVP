import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, AlertCircle, CheckCircle, Clock, Gavel, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RegulatoryOracle() {
  const { t } = useTranslation();
  const [regulatoryUpdates, setRegulatoryUpdates] = useState([
    { 
      jurisdiction: 'Brasil', 
      regulation: 'BACEN Circular 4.122/2024', 
      status: 'implemented', 
      impact: 'high',
      deadline: '2024-03-15',
      compliance: 100
    },
    { 
      jurisdiction: 'EU', 
      regulation: 'MiCA Regulation', 
      status: 'monitoring', 
      impact: 'critical',
      deadline: '2024-12-30',
      compliance: 95
    },
    { 
      jurisdiction: 'USA', 
      regulation: 'FinCEN Rule 2024-01', 
      status: 'pending', 
      impact: 'medium',
      deadline: '2024-06-01',
      compliance: 78
    }
  ]);

  const [globalCompliance, setGlobalCompliance] = useState({
    totalJurisdictions: 47,
    activeRegulations: 156,
    complianceScore: 97.8,
    lastUpdate: new Date().toISOString()
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'monitoring': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/50 rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Globe className="w-8 h-8 text-indigo-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t('security.regulatoryOracle')}</h3>
          <p className="text-indigo-400 text-sm">{t('security.regulatoryIntelligence') || 'Real-time Regulatory Intelligence • 47 Jurisdictions'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-indigo-400">{globalCompliance.totalJurisdictions}</div>
          <div className="text-xs text-indigo-300">Jurisdictions</div>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-400">{globalCompliance.activeRegulations}</div>
          <div className="text-xs text-purple-300">Regulations</div>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-emerald-400">{globalCompliance.complianceScore}%</div>
          <div className="text-xs text-emerald-300">Compliance</div>
        </div>
        
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-cyan-400">24/7</div>
          <div className="text-xs text-cyan-300">Monitoring</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Gavel className="w-4 h-4 text-indigo-400" />
          Recent Regulatory Updates
        </h4>
        
        {regulatoryUpdates.map((update, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(update.status)}
                <div>
                  <div className="text-sm font-bold text-white">{update.regulation}</div>
                  <div className="text-xs text-slate-400">{update.jurisdiction}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold border ${getImpactColor(update.impact)}`}>
                  {update.impact.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Deadline: {new Date(update.deadline).toLocaleDateString()}</span>
              <span className="text-emerald-400 font-bold">{update.compliance}% Ready</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-bold text-white">🌍 GLOBAL COMPLIANCE STATUS</div>
          <div className="text-xs text-emerald-300">Proactive Regulatory Adaptation • Zero Compliance Gaps</div>
        </div>
      </div>
    </motion.div>
  );
}