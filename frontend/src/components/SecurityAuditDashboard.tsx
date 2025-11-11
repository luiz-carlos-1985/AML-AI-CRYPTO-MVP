import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Lock, Zap, Globe } from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  status: 'critical' | 'warning' | 'good' | 'excellent';
  score: number;
  description: string;
  lastCheck: string;
}

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  timestamp: string;
  mitigated: boolean;
}

export const SecurityAuditDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    loadSecurityMetrics();
    loadThreats();
    const interval = setInterval(loadSecurityMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityMetrics = async () => {
    const mockMetrics: SecurityMetric[] = [
      {
        id: 'auth',
        name: t('security.metrics.authentication'),
        status: 'warning',
        score: 65,
        description: t('security.metrics.authDescription'),
        lastCheck: new Date().toISOString()
      },
      {
        id: 'encryption',
        name: t('security.metrics.encryption'),
        status: 'critical',
        score: 45,
        description: t('security.metrics.encryptionDescription'),
        lastCheck: new Date().toISOString()
      },
      {
        id: 'access',
        name: t('security.metrics.accessControl'),
        status: 'good',
        score: 80,
        description: t('security.metrics.accessDescription'),
        lastCheck: new Date().toISOString()
      },
      {
        id: 'monitoring',
        name: t('security.metrics.monitoring'),
        status: 'warning',
        score: 55,
        description: t('security.metrics.monitoringDescription'),
        lastCheck: new Date().toISOString()
      },
      {
        id: 'compliance',
        name: t('security.metrics.compliance'),
        status: 'critical',
        score: 40,
        description: t('security.metrics.complianceDescription'),
        lastCheck: new Date().toISOString()
      },
      {
        id: 'network',
        name: t('security.metrics.networkSecurity'),
        status: 'good',
        score: 75,
        description: t('security.metrics.networkDescription'),
        lastCheck: new Date().toISOString()
      }
    ];

    setMetrics(mockMetrics);
    const avgScore = mockMetrics.reduce((sum, m) => sum + m.score, 0) / mockMetrics.length;
    setSecurityScore(Math.round(avgScore));
  };

  const loadThreats = async () => {
    const mockThreats: SecurityThreat[] = [
      {
        id: '1',
        type: 'BRUTE_FORCE_ATTACK',
        severity: 'HIGH',
        description: t('security.threats.bruteForce'),
        timestamp: new Date(Date.now() - 300000).toISOString(),
        mitigated: false
      },
      {
        id: '2',
        type: 'SUSPICIOUS_LOGIN',
        severity: 'MEDIUM',
        description: t('security.threats.suspiciousLogin'),
        timestamp: new Date(Date.now() - 600000).toISOString(),
        mitigated: true
      },
      {
        id: '3',
        type: 'XSS_ATTEMPT',
        severity: 'CRITICAL',
        description: t('security.threats.xssAttempt'),
        timestamp: new Date(Date.now() - 900000).toISOString(),
        mitigated: false
      }
    ];

    setThreats(mockThreats);
  };

  const runSecurityScan = async () => {
    setIsScanning(true);
    
    // Simular scan de segurança
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Atualizar métricas após scan
    await loadSecurityMetrics();
    await loadThreats();
    
    setIsScanning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('security.audit.title')}
              </h1>
              <p className="text-slate-300">
                {t('security.audit.subtitle')}
              </p>
            </div>
            <button
              onClick={runSecurityScan}
              disabled={isScanning}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t('security.audit.scanning')}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  {t('security.audit.runScan')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Score */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(securityScore)}`}>
                  {securityScore}
                </div>
                <div className="text-white text-lg font-medium mb-1">
                  {t('security.audit.overallScore')}
                </div>
                <div className="text-slate-300 text-sm">
                  {securityScore >= 90 ? t('security.levels.excellent') :
                   securityScore >= 70 ? t('security.levels.good') :
                   securityScore >= 50 ? t('security.levels.warning') :
                   t('security.levels.critical')}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{t('security.certifications.iso27001')}</div>
                    <div className="text-red-400 text-sm">{t('security.status.notCompliant')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="text-white font-medium">{t('security.certifications.soc2')}</div>
                    <div className="text-yellow-400 text-sm">{t('security.status.inProgress')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{t('security.certifications.pciDss')}</div>
                    <div className="text-red-400 text-sm">{t('security.status.notStarted')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              {t('security.audit.securityMetrics')}
            </h2>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <div className="text-white font-medium">{metric.name}</div>
                      <div className="text-slate-300 text-sm">{metric.description}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              {t('security.audit.recentThreats')}
            </h2>
            <div className="space-y-3">
              {threats.map((threat) => (
                <div key={threat.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {new Date(threat.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-white text-sm mb-1">
                    {t(`security.threats.${threat.type.toLowerCase()}`)}
                  </div>
                  <div className="text-slate-300 text-xs">
                    {threat.description}
                  </div>
                  {threat.mitigated && (
                    <div className="mt-2">
                      <span className="text-green-400 text-xs">
                        ✓ {t('security.threats.mitigated')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Actions */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">
              {t('security.audit.criticalActions')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-medium mb-2">
                {t('security.actions.implementMFA')}
              </div>
              <div className="text-slate-300 text-sm mb-3">
                {t('security.actions.mfaDescription')}
              </div>
              <div className="text-red-400 text-xs">
                {t('security.priority.critical')}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-medium mb-2">
                {t('security.actions.upgradeEncryption')}
              </div>
              <div className="text-slate-300 text-sm mb-3">
                {t('security.actions.encryptionDescription')}
              </div>
              <div className="text-red-400 text-xs">
                {t('security.priority.critical')}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-white font-medium mb-2">
                {t('security.actions.implementSIEM')}
              </div>
              <div className="text-slate-300 text-sm mb-3">
                {t('security.actions.siemDescription')}
              </div>
              <div className="text-orange-400 text-xs">
                {t('security.priority.high')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};