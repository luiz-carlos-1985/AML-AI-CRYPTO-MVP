import React, { useState, useEffect } from 'react';
import { Shield, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComplianceNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenNotification, setHasSeenNotification] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('compliance-notification-seen');
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenNotification(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('compliance-notification-seen', 'true');
    setHasSeenNotification(true);
  };

  const complianceItems = [
    { label: 'LGPD', status: 'compliant', description: 'Proteção de dados implementada' },
    { label: 'COAF', status: 'compliant', description: 'Sistema de comunicação ativo' },
    { label: 'BACEN', status: 'compliant', description: 'Controles internos operacionais' },
    { label: 'ISO 27001', status: 'implemented', description: 'Segurança da informação' }
  ];

  if (hasSeenNotification && !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md mx-auto sm:mx-0"
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-blue-600/10 border border-green-500/20 rounded-xl p-3 sm:p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-white">Sistema Compliance Ready</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-gray-300 mb-2 sm:mb-3">
              Implementações de conformidade regulatória ativas:
            </p>
            
            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
              {complianceItems.map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  {item.status === 'compliant' ? (
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-white font-medium">{item.label}</span>
                    <span className="text-xs text-gray-400 block sm:inline sm:ml-1">- {item.description}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="/compliance"
                className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors text-center"
              >
                Ver Detalhes
              </a>
              <button
                onClick={handleClose}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComplianceNotification;