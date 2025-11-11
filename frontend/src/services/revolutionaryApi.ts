import api from './api';

export interface QuantumComplianceResult {
  complianceScore: number;
  quantumRiskLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictiveInsights: string[];
  regulatoryAlignment: Record<string, number>;
  futureRiskPrediction: number;
  quantumFingerprint: string;
}

export interface TransparencyRecord {
  blockHash: string;
  timestamp: number;
  action: string;
  publicVerificationUrl: string;
  complianceProof: string;
}

export interface PerformanceStats {
  current: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    quantumEfficiency: number;
  };
  cache: {
    size: number;
    maxSize: number;
    hitRate: number;
    quantumEfficiency: number;
  };
  predictive: {
    modelsCount: number;
    recommendations: number;
  };
}

export interface AdaptiveRecommendation {
  type: string;
  priority: number;
  description: string;
  implementation: any;
  expectedImpact: number;
  confidence: number;
}

export interface UserStats {
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  adaptationScore: number;
  totalInteractions: number;
  errorRate: number;
  featureUsage: number;
}

export interface PredictiveInsights {
  performance: {
    predictedLoad: number;
    recommendedOptimizations: string[];
    quantumEfficiencyTrend: string;
  };
  userExperience: {
    skillProgression: string;
    nextLevelPrediction: string;
    recommendedFeatures: string[];
    adaptationSuccess: boolean;
  };
  compliance: {
    riskTrend: string;
    upcomingRequirements: string[];
    transparencyScore: number;
    auditReadiness: string;
  };
  business: {
    userEngagement: string;
    featureAdoption: string;
    compliancePosture: string;
    systemReliability: string;
  };
}

class RevolutionaryApiService {
  // 🧠 Quantum Compliance
  async analyzeQuantumCompliance(data: {
    transactionData: any;
    userProfile: any;
    jurisdiction?: string;
  }): Promise<{ success: boolean; quantumAnalysis: QuantumComplianceResult; transparencyHash: string; verificationUrl: string }> {
    const response = await api.post('/revolutionary/quantum-compliance/analyze', data);
    return response.data;
  }

  // 🔗 Transparency Blockchain
  async getTransparencyAuditTrail(params?: {
    entityId?: string;
    startDate?: number;
    endDate?: number;
  }): Promise<{ success: boolean; auditTrail: TransparencyRecord[]; blockchainStats: any; isValid: boolean }> {
    const response = await api.get('/revolutionary/transparency/audit-trail', { params });
    return response.data;
  }

  async exportTransparencyReport(): Promise<{ success: boolean; exportData: any; downloadUrl: string; verificationHash: string }> {
    const response = await api.get('/revolutionary/transparency/export');
    return response.data;
  }

  // ⚡ Quantum Performance
  async getQuantumPerformanceStats(): Promise<{ success: boolean; performance: PerformanceStats; quantumEfficiency: number; recommendations: any }> {
    const response = await api.get('/revolutionary/quantum-performance/stats');
    return response.data;
  }

  async optimizeQuantumCache(data: {
    cacheKey?: string;
    operation: 'clear' | 'preload';
  }): Promise<{ success: boolean; operation: string; result: any; newStats: PerformanceStats }> {
    const response = await api.post('/revolutionary/quantum-performance/optimize-cache', data);
    return response.data;
  }

  // 🎨 Adaptive UX
  async recordUserInteraction(data: {
    sessionId: string;
    action: string;
    element: string;
    duration?: number;
    success?: boolean;
    errorCount?: number;
    helpRequested?: boolean;
    context?: any;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/revolutionary/adaptive-ux/interaction', data);
    return response.data;
  }

  async getAdaptiveRecommendations(): Promise<{ success: boolean; recommendations: AdaptiveRecommendation[]; userStats: UserStats; adaptationLevel: number }> {
    const response = await api.get('/revolutionary/adaptive-ux/recommendations');
    return response.data;
  }

  async setAccessibilityProfile(profile: {
    visualImpairment: boolean;
    motorImpairment: boolean;
    cognitiveImpairment: boolean;
    hearingImpairment: boolean;
    preferredFontSize: number;
    highContrast: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
  }): Promise<{ success: boolean; message: string; profile: any }> {
    const response = await api.post('/revolutionary/adaptive-ux/accessibility-profile', profile);
    return response.data;
  }

  // 🔮 Predictive Analytics
  async getPredictiveInsights(params?: {
    timeframe?: string;
    analysisType?: string;
  }): Promise<{ success: boolean; insights: PredictiveInsights; generatedAt: string; confidence: number; recommendations: string[] }> {
    const response = await api.get('/revolutionary/predictive/insights', { params });
    return response.data;
  }

  // 🌟 Revolutionary Dashboard
  async getRevolutionaryDashboard(): Promise<{ success: boolean; dashboard: any; lastUpdated: string; revolutionaryFeatures: string[] }> {
    const response = await api.get('/revolutionary/dashboard/revolutionary');
    return response.data;
  }
}

export const revolutionaryApi = new RevolutionaryApiService();