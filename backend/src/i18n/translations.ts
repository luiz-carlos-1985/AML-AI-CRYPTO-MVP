// Internationalization for Backend Services
export const translations = {
  en: {
    security: {
      systemIntegrityViolation: 'System integrity violation detected',
      highRiskRequestBlocked: 'Request blocked due to high risk score',
      botDetected: 'Automated requests not allowed',
      cloneDetected: 'Unauthorized system access',
      invalidLicense: 'Invalid system license'
    },
    compliance: {
      aiAnalysisTitle: 'AI Analysis: High Risk Transaction',
      suspiciousTransactionDetected: 'Suspicious Transaction Detected',
      coafReportingRequired: 'Transaction requires COAF reporting',
      smurfingPatternDetected: 'Smurfing pattern detected',
      manualReviewRequired: 'Manual review required immediately'
    },
    intelligence: {
      sanctionedAddress: 'Address found in sanction lists',
      mixerAddress: 'Cryptocurrency mixer detected',
      highCentrality: 'High centrality detected',
      peelChainPattern: 'Peel chain pattern detected'
    },
    system: {
      advancedSystemStarted: 'CRYPTOAML ADVANCED SYSTEM STARTED',
      securitySystemsInitialized: 'Advanced security systems initialized'
    }
  },
  pt: {
    security: {
      systemIntegrityViolation: 'Violação de integridade do sistema detectada',
      highRiskRequestBlocked: 'Requisição bloqueada devido ao alto risco',
      botDetected: 'Requisições automatizadas não permitidas',
      cloneDetected: 'Acesso não autorizado ao sistema',
      invalidLicense: 'Licença do sistema inválida'
    },
    compliance: {
      aiAnalysisTitle: 'Análise de IA: Transação de Alto Risco',
      suspiciousTransactionDetected: 'Transação Suspeita Detectada',
      coafReportingRequired: 'Transação requer comunicação ao COAF',
      smurfingPatternDetected: 'Padrão de estruturação detectado',
      manualReviewRequired: 'Revisão manual necessária imediatamente'
    },
    intelligence: {
      sanctionedAddress: 'Endereço encontrado em listas de sanções',
      mixerAddress: 'Mixer de criptomoedas detectado',
      highCentrality: 'Alta centralidade detectada',
      peelChainPattern: 'Padrão de peel chain detectado'
    },
    system: {
      advancedSystemStarted: 'SISTEMA AVANÇADO CRYPTOAML INICIADO',
      securitySystemsInitialized: 'Sistemas de segurança avançados inicializados'
    }
  }
};

export function t(key: string, lang: string = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang as keyof typeof translations] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
}

export function detectLanguage(acceptLanguage?: string): string {
  if (!acceptLanguage) return 'en';
  
  const supportedLanguages = ['en', 'pt', 'es', 'fr', 'de'];
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());
  
  for (const lang of preferredLanguages) {
    if (supportedLanguages.includes(lang)) return lang;
    const langCode = lang.split('-')[0];
    if (supportedLanguages.includes(langCode)) return langCode;
  }
  
  return 'en';
}