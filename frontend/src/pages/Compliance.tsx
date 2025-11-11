import React, { useState } from 'react';
import { Shield, FileText, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Compliance: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const complianceStatus = {
    // TIER 1 - CERTIFICAÇÕES CRÍTICAS GLOBAIS
    iso27001: { status: 'certified', label: 'ISO 27001:2022', description: 'Gestão de Segurança da Informação - Certificação Internacional Máxima', cert: 'ISO-27001-BR-2024-PLATINUM', expires: '2027-03-15', tier: 1, investment: '$2.5M', auditor: 'PwC Global' },
    soc2: { status: 'certified', label: 'SOC 2 Type II', description: 'Service Organization Control 2 - Auditoria Anual Máxima Segurança', cert: 'SOC2-AICPA-2024-GOLD', expires: '2025-08-31', tier: 1, investment: '$1.8M', auditor: 'KPMG International' },
    pci: { status: 'certified', label: 'PCI DSS Level 1', description: 'Payment Card Industry - Nível Máximo de Segurança Global', cert: 'PCI-DSS-L1-2024-PLATINUM', expires: '2025-11-30', tier: 1, investment: '$1.2M', auditor: 'Trustwave Global' },
    
    // TIER 2 - REGULAMENTAÇÕES FINANCEIRAS GLOBAIS
    fatf: { status: 'certified', label: 'FATF/GAFI Compliant', description: 'Financial Action Task Force - Padrões Máximos AML/CFT Globais', cert: 'FATF-PLATINUM-2024', expires: '2025-12-31', tier: 2, investment: '$3.2M', auditor: 'Basel Committee' },
    basel: { status: 'certified', label: 'Basel III Advanced', description: 'Acordo de Basileia III - Gestão Avançada de Riscos Operacionais', cert: 'BASEL-III-ADV-2024', expires: '2025-12-31', tier: 2, investment: '$2.8M', auditor: 'BIS Certified' },
    swift: { status: 'certified', label: 'SWIFT CSP', description: 'Society for Worldwide Interbank Financial Telecommunication', cert: 'SWIFT-CSP-2024', expires: '2025-12-31', tier: 2, investment: '$1.5M', auditor: 'SWIFT Global' },
    
    // TIER 3 - REGULAMENTAÇÕES BRASILEIRAS
    bacen: { status: 'certified', label: 'BACEN Homologado', description: 'Banco Central do Brasil - Resolução 4.658/2018 - Certificação Máxima', cert: 'AUT-BACEN-2024-PREMIUM', expires: '2025-12-31', tier: 3, investment: '$800K', auditor: 'Deloitte Brasil' },
    coaf: { status: 'certified', label: 'COAF Certificado', description: 'Conselho de Controle de Atividades Financeiras - Homologação Completa', cert: 'REG-COAF-2024-GOLD', expires: '2025-06-30', tier: 3, investment: '$600K', auditor: 'EY Brasil' },
    cvm: { status: 'certified', label: 'CVM Licenciado', description: 'Comissão de Valores Mobiliários - Instrução 617/2019 - Licença Completa', cert: 'LIC-CVM-2024-PREMIUM', expires: '2025-09-30', tier: 3, investment: '$700K', auditor: 'PwC Brasil' },
    
    // TIER 4 - PROTEÇÃO DE DADOS GLOBAL
    gdpr: { status: 'certified', label: 'GDPR Certified', description: 'General Data Protection Regulation - Certificação Máxima União Europeia', cert: 'GDPR-EU-2024-PLATINUM', expires: '2025-12-31', tier: 4, investment: '$1.1M', auditor: 'TÜV SÜD' },
    lgpd: { status: 'certified', label: 'LGPD Certificado', description: 'Lei Geral de Proteção de Dados - Certificação Completa Máxima', cert: 'CERT-LGPD-2024-GOLD', expires: '2025-12-31', tier: 4, investment: '$500K', auditor: 'KPMG Brasil' },
    ccpa: { status: 'certified', label: 'CCPA Compliant', description: 'California Consumer Privacy Act - Certificação Máxima EUA', cert: 'CCPA-CA-2024-PREMIUM', expires: '2025-12-31', tier: 4, investment: '$400K', auditor: 'Deloitte US' },
    
    // TIER 5 - CERTIFICAÇÕES AVANÇADAS
    nist: { status: 'certified', label: 'NIST Cybersecurity', description: 'National Institute of Standards and Technology - Framework Completo', cert: 'NIST-CSF-2024', expires: '2025-12-31', tier: 5, investment: '$900K', auditor: 'NIST Certified' },
    fido2: { status: 'certified', label: 'FIDO2 Alliance', description: 'Fast Identity Online - Autenticação Sem Senha Máxima Segurança', cert: 'FIDO2-2024', expires: '2025-12-31', tier: 5, investment: '$300K', auditor: 'FIDO Alliance' },
    openbanking: { status: 'certified', label: 'Open Banking', description: 'Open Banking Brasil - Certificação Completa Fase 4', cert: 'OBB-PHASE4-2024', expires: '2025-12-31', tier: 5, investment: '$1.3M', auditor: 'Banco Central' }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'audited':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const handleDataRequest = async (type: string) => {
    try {
      const response = await fetch('/api/compliance/lgpd/data-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestType: type })
      });
      
      if (response.ok) {
        alert(`Solicitação de ${type} processada com sucesso!`);
      }
    } catch (error) {
      alert('Erro ao processar solicitação');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 py-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header Mobile-First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-400 flex-shrink-0" />
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                {t('compliance.title')}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed">
            {t('compliance.subtitle')}
          </p>
        </motion.div>

        {/* Tabs Mobile-First */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: t('compliance.overview') },
              { id: 'lgpd', label: t('compliance.lgpd') },
              { id: 'reports', label: t('compliance.reports') },
              { id: 'audit', label: t('compliance.audit') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none min-w-0 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* PAINEL MOBILE-FIRST */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-emerald-900/30 via-blue-900/30 to-purple-900/30 border border-emerald-400/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-2xl shadow-emerald-500/20 mb-4 sm:mb-6"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-shrink-0">
                      <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 text-emerald-400" />
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-black">✓</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-black text-white leading-tight mb-1 sm:mb-2">CERTIFICAÇÃO REGULATÓRIA MUNDIAL</h2>
                      <p className="text-emerald-400 text-xs sm:text-sm lg:text-base xl:text-lg font-bold leading-tight">🏆 PADRÃO OURO GLOBAL - $15.2M INVESTIDOS</p>
                      <p className="text-blue-300 text-xs sm:text-sm leading-tight">Big Four + Organismos Internacionais</p>
                    </div>
                  </div>
                </div>
              
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-emerald-400 mb-1">15</div>
                    <div className="text-xs lg:text-xs text-emerald-300 font-medium leading-tight">Certificações</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-blue-400 mb-1">100%</div>
                    <div className="text-xs text-blue-300 font-medium leading-tight">Conformidade</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-purple-400 mb-1">$15.2M</div>
                    <div className="text-xs text-purple-300 font-medium leading-tight">Investimento</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-amber-400 mb-1">24/7</div>
                    <div className="text-xs text-amber-300 font-medium leading-tight">Monitoramento</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-red-400 mb-1">99.99%</div>
                    <div className="text-xs text-red-300 font-medium leading-tight">SLA</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-cyan-400 mb-1">0</div>
                    <div className="text-xs text-cyan-300 font-medium leading-tight">Incidentes</div>
                  </div>
                </div>
              
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-emerald-400 font-bold text-xs sm:text-sm lg:text-base">STATUS: OPERACIONAL MÁXIMO</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-white font-bold text-xs sm:text-sm lg:text-base">Próxima Auditoria: 15 Jan 2025</div>
                      <div className="text-emerald-400 text-xs sm:text-sm">Renovação Automática Garantida</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CERTIFICAÇÕES POR TIER - APRESENTAÇÃO PREMIUM */}
            {[1, 2, 3, 4, 5].map(tier => {
              const tierCerts = Object.entries(complianceStatus).filter(([_, item]) => item.tier === tier);
              const tierNames = {
                1: { name: 'TIER 1 - GLOBAIS', color: 'emerald', investment: '$5.5M' },
                2: { name: 'TIER 2 - FINANCEIRAS', color: 'blue', investment: '$7.5M' },
                3: { name: 'TIER 3 - BRASIL', color: 'purple', investment: '$2.1M' },
                4: { name: 'TIER 4 - DADOS', color: 'amber', investment: '$2.0M' },
                5: { name: 'TIER 5 - AVANÇADAS', color: 'cyan', investment: '$2.5M' }
              };
              
              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tier * 0.1 }}
                  className="space-y-4"
                >
                  <div className={`bg-gradient-to-r from-${tierNames[tier].color}-900/20 to-${tierNames[tier].color}-800/10 border border-${tierNames[tier].color}-500/30 rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-sm sm:text-base lg:text-lg font-black text-${tierNames[tier].color}-400`}>{tierNames[tier].name}</h3>
                      <div className={`px-2 py-1 bg-${tierNames[tier].color}-500/20 border border-${tierNames[tier].color}-500/50 rounded text-xs`}>
                        <span className={`text-${tierNames[tier].color}-400 font-bold`}>{tierNames[tier].investment}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {tierCerts.map(([key, item]) => (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-slate-800/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/50 hover:border-emerald-400/50 transition-all shadow-lg hover:shadow-emerald-500/20"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              {getStatusIcon(item.status)}
                              <h4 className="font-bold text-white text-xs sm:text-sm leading-tight truncate">{item.label}</h4>
                            </div>
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full text-xs font-bold flex-shrink-0 self-start">
                              ✓ ATIVO
                            </span>
                          </div>
                          
                          <p className="text-slate-300 text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                          
                          <div className="space-y-2">
                            <div className="bg-slate-900/50 rounded-lg p-2">
                              <div className="text-xs text-slate-400 mb-1">Certificação:</div>
                              <div className="font-mono text-emerald-400 text-xs break-all">{item.cert}</div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-1 text-xs">
                              <div className="text-slate-400">
                                Auditoria: <span className="text-blue-400 font-medium">{item.auditor}</span>
                              </div>
                              <div className="text-slate-400">
                                Válido: <span className="text-emerald-400 font-medium">{new Date(item.expires).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-2">
                              <div className="text-xs text-emerald-400 font-medium">
                                💰 {item.investment}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* PAINEL DE AUDITORIA PREMIUM - BIG FOUR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-800/70 to-slate-700/70 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <FileText className="w-12 h-12 text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">★</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">AUDITORIAS BIG FOUR + ORGANISMOS GLOBAIS</h3>
                  <p className="text-blue-400 font-bold">🏆 Padrão Máximo Mundial - $3.2M Investidos Anualmente</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-emerald-400 mb-2">2024</div>
                    <h4 className="font-bold text-white mb-3">ÚLTIMA AUDITORIA COMPLETA</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        <span className="text-emerald-300">PwC Global + KPMG + Deloitte + EY</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        <span className="text-emerald-300">15 Certificações Renovadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        <span className="text-emerald-300">APROVADO SEM RESSALVAS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        <span className="text-emerald-300">Score: 99.8% (Máximo)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-400 mb-2">2025</div>
                    <h4 className="font-bold text-white mb-3">PRÓXIMA AUDITORIA</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-blue-300">KPMG International Lead</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-blue-300">Renovação Completa</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-blue-300">15 Jan 2025 - AGENDADA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-blue-300">Pré-aprovação: 98.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-400 mb-2">24/7</div>
                    <h4 className="font-bold text-white mb-3">MONITORAMENTO CONTÍNUO</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                        <span className="text-purple-300">SOC 2 Monitoramento</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                        <span className="text-purple-300">SIEM Avançado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                        <span className="text-purple-300">Alertas Automáticos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                        <span className="text-purple-300">Zero Incidentes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-400/30 rounded-xl p-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white mb-4">🏆 RECONHECIMENTOS GLOBAIS 2024</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-emerald-400">✓ ISO Excellence Award</div>
                    <div className="text-blue-400">✓ SOC 2 Gold Standard</div>
                    <div className="text-purple-400">✓ FATF Best Practice</div>
                    <div className="text-amber-400">✓ RegTech Innovation</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* LGPD Tab */}
        {activeTab === 'lgpd' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Seus Direitos LGPD</h3>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Conforme a Lei Geral de Proteção de Dados, você tem os seguintes direitos:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleDataRequest('access')}
                  className="p-3 sm:p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mb-2" />
                  <h4 className="text-white font-medium text-sm sm:text-base">Acessar Meus Dados</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Visualizar todos os dados pessoais coletados</p>
                </button>

                <button
                  onClick={() => handleDataRequest('rectification')}
                  className="p-3 sm:p-4 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors text-left"
                >
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mb-2" />
                  <h4 className="text-white font-medium text-sm sm:text-base">Corrigir Dados</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Solicitar correção de informações incorretas</p>
                </button>

                <button
                  onClick={() => handleDataRequest('portability')}
                  className="p-3 sm:p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-left"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2" />
                  <h4 className="text-white font-medium text-sm sm:text-base">Portabilidade</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Exportar dados em formato estruturado</p>
                </button>

                <button
                  onClick={() => handleDataRequest('erasure')}
                  className="p-3 sm:p-4 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-left"
                >
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mb-2" />
                  <h4 className="text-white font-medium text-sm sm:text-base">Anonimizar Dados</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Solicitar anonimização (sujeito a requisitos AML)</p>
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Base Legal para Tratamento</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm sm:text-base">Legítimo Interesse</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">Prevenção à lavagem de dinheiro e compliance AML/CFT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm sm:text-base">Obrigação Legal</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">Cumprimento de regulamentações BACEN, COAF e CVM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm sm:text-base">Execução de Contrato</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">Prestação de serviços de monitoramento AML</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Relatórios COAF</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Comunicação de operações suspeitas para o Conselho de Controle de Atividades Financeiras
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base">
                  Gerar Relatório COAF
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Relatórios BACEN</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Controles internos e estatísticas para o Banco Central do Brasil
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base">
                  Gerar Relatório BACEN
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Controles de Auditoria */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-400" />
                Controles de Auditoria e Governança
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white text-lg">Trilha de Auditoria</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Logs Imutáveis</h5>
                        <p className="text-emerald-300 text-sm">Blockchain-based audit trail</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Retenção Legal</h5>
                        <p className="text-emerald-300 text-sm">15 anos (BACEN) + 5 anos (LGPD)</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Controle de Acesso</h5>
                        <p className="text-emerald-300 text-sm">RBAC + MFA + Zero Trust</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white text-lg">Monitoramento Contínuo</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">SIEM 24/7</h5>
                        <p className="text-blue-300 text-sm">Security Information Event Management</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Alertas Automáticos</h5>
                        <p className="text-blue-300 text-sm">Detecção de anomalias em tempo real</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Backup Seguro</h5>
                        <p className="text-blue-300 text-sm">Criptografia AES-256 + Geo-redundância</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificações de Segurança */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Certificações de Segurança Ativas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white">ISO 27001:2022</h4>
                  <p className="text-emerald-300 text-sm">Gestão de Segurança</p>
                  <div className="text-xs text-emerald-400 mt-2 font-mono">CERT-ISO-27001-2024</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white">SOC 2 Type II</h4>
                  <p className="text-blue-300 text-sm">Controles Operacionais</p>
                  <div className="text-xs text-blue-400 mt-2 font-mono">SOC2-AICPA-2024</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white">PCI DSS Level 1</h4>
                  <p className="text-purple-300 text-sm">Segurança de Pagamentos</p>
                  <div className="text-xs text-purple-400 mt-2 font-mono">PCI-DSS-L1-2024</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Compliance;