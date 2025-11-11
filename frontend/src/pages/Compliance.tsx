import React, { useState } from 'react';
import { Shield, FileText, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const complianceStatus = {
    lgpd: { status: 'compliant', label: 'LGPD', description: 'Proteção de Dados' },
    coaf: { status: 'compliant', label: 'COAF', description: 'Operações Suspeitas' },
    bacen: { status: 'compliant', label: 'BACEN', description: 'Controles Internos' },
    iso27001: { status: 'implemented', label: 'ISO 27001', description: 'Segurança da Informação' },
    soc2: { status: 'implemented', label: 'SOC 2', description: 'Controles Operacionais' },
    fatf: { status: 'compliant', label: 'FATF', description: 'Padrões Internacionais' }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'implemented':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Compliance & Certificações</h1>
          </div>
          <p className="text-gray-300">
            Sistema em conformidade com regulamentações brasileiras e internacionais
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'lgpd', label: 'LGPD' },
            { id: 'reports', label: 'Relatórios' },
            { id: 'audit', label: 'Auditoria' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Object.entries(complianceStatus).map(([key, item]) => (
              <div key={key} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    {getStatusIcon(item.status)}
                    <h3 className="text-base sm:text-lg font-semibold text-white">{item.label}</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'compliant' 
                      ? 'bg-green-500/20 text-green-400'
                      : item.status === 'implemented'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status === 'compliant' ? 'Conforme' : 
                     item.status === 'implemented' ? 'Implementado' : 'Em Progresso'}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
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
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Trilha de Auditoria</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Todas as ações no sistema são registradas para conformidade regulatória
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm sm:text-base">Logs de Auditoria</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Registro completo de todas as ações</p>
                </div>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 ml-2" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Retenção de Dados</h4>
                  <p className="text-gray-300 text-sm">10 anos conforme regulamentação AML</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Controle de Acesso</h4>
                  <p className="text-gray-300 text-sm">RBAC implementado conforme ISO 27001</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Compliance;