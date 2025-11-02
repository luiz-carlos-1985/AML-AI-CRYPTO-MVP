export interface PlanLimits {
  maxWallets: number;
  maxTransactionsPerMonth: number;
  features: {
    advancedAI: boolean;
    realTimeAlerts: boolean;
    prioritySupport: boolean;
    customReports: boolean;
    apiAccess: boolean;
    complianceTools: boolean;
    customAIModels: boolean;
    instantAlerts: boolean;
    dedicatedSupport: boolean;
    whitelabelReports: boolean;
    fullAPIAccess: boolean;
    complianceSuite: boolean;
    multiUserAccess: boolean;
    slaGuarantee: boolean;
  };
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  STARTER: {
    maxWallets: 5,
    maxTransactionsPerMonth: 100,
    features: {
      advancedAI: false,
      realTimeAlerts: false,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
      complianceTools: false,
      customAIModels: false,
      instantAlerts: false,
      dedicatedSupport: false,
      whitelabelReports: false,
      fullAPIAccess: false,
      complianceSuite: false,
      multiUserAccess: false,
      slaGuarantee: false
    }
  },
  GROWTH: {
    maxWallets: 50,
    maxTransactionsPerMonth: 10000,
    features: {
      advancedAI: true,
      realTimeAlerts: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
      complianceTools: true,
      customAIModels: false,
      instantAlerts: false,
      dedicatedSupport: false,
      whitelabelReports: false,
      fullAPIAccess: false,
      complianceSuite: false,
      multiUserAccess: false,
      slaGuarantee: false
    }
  },
  ENTERPRISE: {
    maxWallets: -1, // unlimited
    maxTransactionsPerMonth: -1, // unlimited
    features: {
      advancedAI: true,
      realTimeAlerts: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
      complianceTools: true,
      customAIModels: true,
      instantAlerts: true,
      dedicatedSupport: true,
      whitelabelReports: true,
      fullAPIAccess: true,
      complianceSuite: true,
      multiUserAccess: true,
      slaGuarantee: true
    }
  }
};

export const getPlanLimits = (plan: string): PlanLimits => {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.STARTER;
};

export const canAddWallet = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  if (limits.maxWallets === -1) return true;
  return currentCount < limits.maxWallets;
};

export const canAddTransaction = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  if (limits.maxTransactionsPerMonth === -1) return true;
  return currentCount < limits.maxTransactionsPerMonth;
};

export const hasFeature = (plan: string, feature: keyof PlanLimits['features']): boolean => {
  const limits = getPlanLimits(plan);
  return limits.features[feature];
};
