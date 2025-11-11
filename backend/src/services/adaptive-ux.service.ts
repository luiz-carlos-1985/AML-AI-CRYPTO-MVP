import { EventEmitter } from 'events';

interface UserBehaviorPattern {
  userId: string;
  sessionId: string;
  interactions: UserInteraction[];
  preferences: UserPreferences;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  adaptationScore: number;
}

interface UserInteraction {
  timestamp: number;
  action: string;
  element: string;
  duration: number;
  success: boolean;
  errorCount: number;
  helpRequested: boolean;
  context: any;
}

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: boolean;
  shortcuts: boolean;
  tooltips: boolean;
  notifications: 'all' | 'important' | 'minimal';
  dashboardLayout: string[];
  favoriteFeatures: string[];
}

interface AdaptiveRecommendation {
  type: 'UI_SIMPLIFICATION' | 'FEATURE_HIGHLIGHT' | 'WORKFLOW_OPTIMIZATION' | 'PERSONALIZATION';
  priority: number;
  description: string;
  implementation: any;
  expectedImpact: number;
  confidence: number;
}

interface AccessibilityProfile {
  visualImpairment: boolean;
  motorImpairment: boolean;
  cognitiveImpairment: boolean;
  hearingImpairment: boolean;
  preferredFontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
}

class AdaptiveUXEngine extends EventEmitter {
  private userPatterns = new Map<string, UserBehaviorPattern>();
  private globalPatterns = new Map<string, number>();
  private adaptationRules = new Map<string, any>();
  private accessibilityProfiles = new Map<string, AccessibilityProfile>();

  constructor() {
    super();
    this.initializeAdaptationRules();
    this.startBehaviorAnalysis();
  }

  // Inicializar regras de adaptação
  private initializeAdaptationRules(): void {
    this.adaptationRules.set('BEGINNER_SIMPLIFICATION', {
      condition: (pattern: UserBehaviorPattern) => pattern.skillLevel === 'BEGINNER',
      adaptations: [
        { type: 'HIDE_ADVANCED_FEATURES', weight: 0.8 },
        { type: 'SHOW_GUIDED_TOUR', weight: 0.9 },
        { type: 'ENABLE_TOOLTIPS', weight: 0.7 },
        { type: 'SIMPLIFY_NAVIGATION', weight: 0.6 }
      ]
    });

    this.adaptationRules.set('HIGH_ERROR_RATE', {
      condition: (pattern: UserBehaviorPattern) => this.calculateErrorRate(pattern) > 0.3,
      adaptations: [
        { type: 'SHOW_CONTEXTUAL_HELP', weight: 0.9 },
        { type: 'HIGHLIGHT_CORRECT_ACTIONS', weight: 0.8 },
        { type: 'REDUCE_COGNITIVE_LOAD', weight: 0.7 }
      ]
    });

    this.adaptationRules.set('POWER_USER_OPTIMIZATION', {
      condition: (pattern: UserBehaviorPattern) => pattern.skillLevel === 'EXPERT',
      adaptations: [
        { type: 'ENABLE_SHORTCUTS', weight: 0.9 },
        { type: 'SHOW_ADVANCED_FEATURES', weight: 0.8 },
        { type: 'COMPACT_LAYOUT', weight: 0.7 },
        { type: 'DISABLE_CONFIRMATIONS', weight: 0.6 }
      ]
    });

    this.adaptationRules.set('ACCESSIBILITY_ENHANCEMENT', {
      condition: (pattern: UserBehaviorPattern) => this.hasAccessibilityNeeds(pattern.userId),
      adaptations: [
        { type: 'HIGH_CONTRAST_MODE', weight: 1.0 },
        { type: 'LARGE_FONTS', weight: 0.9 },
        { type: 'KEYBOARD_NAVIGATION', weight: 0.8 },
        { type: 'SCREEN_READER_SUPPORT', weight: 0.9 }
      ]
    });
  }

  // Registrar interação do usuário
  async recordUserInteraction(
    userId: string,
    sessionId: string,
    interaction: Omit<UserInteraction, 'timestamp'>
  ): Promise<void> {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now()
    };

    let pattern = this.userPatterns.get(userId);
    if (!pattern) {
      pattern = {
        userId,
        sessionId,
        interactions: [],
        preferences: await this.getDefaultPreferences(),
        skillLevel: 'BEGINNER',
        adaptationScore: 0
      };
      this.userPatterns.set(userId, pattern);
    }

    pattern.interactions.push(fullInteraction);
    
    // Manter apenas últimas 1000 interações
    if (pattern.interactions.length > 1000) {
      pattern.interactions = pattern.interactions.slice(-1000);
    }

    // Atualizar nível de habilidade
    pattern.skillLevel = this.calculateSkillLevel(pattern);
    pattern.adaptationScore = this.calculateAdaptationScore(pattern);

    // Análise em tempo real
    await this.analyzeAndAdapt(userId);

    this.emit('interaction-recorded', { userId, interaction: fullInteraction });
  }

  // Analisar comportamento e gerar adaptações
  private async analyzeAndAdapt(userId: string): Promise<AdaptiveRecommendation[]> {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return [];

    const recommendations: AdaptiveRecommendation[] = [];

    // Aplicar regras de adaptação
    for (const [ruleName, rule] of this.adaptationRules) {
      if (rule.condition(pattern)) {
        for (const adaptation of rule.adaptations) {
          const recommendation = await this.generateRecommendation(
            adaptation,
            pattern,
            ruleName
          );
          recommendations.push(recommendation);
        }
      }
    }

    // Ordenar por prioridade e confiança
    recommendations.sort((a, b) => (b.priority * b.confidence) - (a.priority * a.confidence));

    // Aplicar adaptações automaticamente se confiança > 0.8
    const autoAdaptations = recommendations.filter(r => r.confidence > 0.8);
    for (const adaptation of autoAdaptations) {
      await this.applyAdaptation(userId, adaptation);
    }

    this.emit('adaptations-generated', { userId, recommendations });
    return recommendations;
  }

  // Gerar recomendação específica
  private async generateRecommendation(
    adaptation: any,
    pattern: UserBehaviorPattern,
    ruleName: string
  ): Promise<AdaptiveRecommendation> {
    const confidence = this.calculateConfidence(adaptation, pattern);
    const expectedImpact = this.calculateExpectedImpact(adaptation, pattern);

    return {
      type: adaptation.type,
      priority: adaptation.weight * 10,
      description: this.getAdaptationDescription(adaptation.type, pattern),
      implementation: this.getImplementationDetails(adaptation.type, pattern),
      expectedImpact,
      confidence
    };
  }

  // Calcular nível de habilidade do usuário
  private calculateSkillLevel(pattern: UserBehaviorPattern): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' {
    const interactions = pattern.interactions;
    if (interactions.length < 10) return 'BEGINNER';

    const avgDuration = interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length;
    const errorRate = this.calculateErrorRate(pattern);
    const featureUsage = this.calculateFeatureUsage(pattern);
    const helpRequests = interactions.filter(i => i.helpRequested).length / interactions.length;

    let score = 0;
    
    // Velocidade de interação (menor duração = mais habilidoso)
    if (avgDuration < 2000) score += 3;
    else if (avgDuration < 5000) score += 2;
    else if (avgDuration < 10000) score += 1;

    // Taxa de erro (menor = mais habilidoso)
    if (errorRate < 0.05) score += 3;
    else if (errorRate < 0.15) score += 2;
    else if (errorRate < 0.3) score += 1;

    // Uso de recursos avançados
    if (featureUsage > 0.7) score += 3;
    else if (featureUsage > 0.4) score += 2;
    else if (featureUsage > 0.2) score += 1;

    // Pedidos de ajuda (menos = mais habilidoso)
    if (helpRequests < 0.05) score += 2;
    else if (helpRequests < 0.15) score += 1;

    if (score >= 10) return 'EXPERT';
    if (score >= 7) return 'ADVANCED';
    if (score >= 4) return 'INTERMEDIATE';
    return 'BEGINNER';
  }

  // Calcular taxa de erro
  private calculateErrorRate(pattern: UserBehaviorPattern): number {
    const interactions = pattern.interactions;
    if (interactions.length === 0) return 0;

    const totalErrors = interactions.reduce((sum, i) => sum + i.errorCount, 0);
    return totalErrors / interactions.length;
  }

  // Calcular uso de recursos
  private calculateFeatureUsage(pattern: UserBehaviorPattern): number {
    const interactions = pattern.interactions;
    const uniqueFeatures = new Set(interactions.map(i => i.element));
    const totalFeatures = 50; // Número estimado de recursos disponíveis
    
    return uniqueFeatures.size / totalFeatures;
  }

  // Calcular pontuação de adaptação
  private calculateAdaptationScore(pattern: UserBehaviorPattern): number {
    const skillMultiplier = {
      'BEGINNER': 0.5,
      'INTERMEDIATE': 0.7,
      'ADVANCED': 0.9,
      'EXPERT': 1.0
    };

    const errorPenalty = this.calculateErrorRate(pattern) * 0.3;
    const usageBonus = this.calculateFeatureUsage(pattern) * 0.2;
    
    return Math.max(0, Math.min(1, 
      skillMultiplier[pattern.skillLevel] - errorPenalty + usageBonus
    ));
  }

  // Verificar necessidades de acessibilidade
  private hasAccessibilityNeeds(userId: string): boolean {
    const profile = this.accessibilityProfiles.get(userId);
    return profile ? (
      profile.visualImpairment ||
      profile.motorImpairment ||
      profile.cognitiveImpairment ||
      profile.hearingImpairment
    ) : false;
  }

  // Calcular confiança da recomendação
  private calculateConfidence(adaptation: any, pattern: UserBehaviorPattern): number {
    let confidence = adaptation.weight;
    
    // Ajustar baseado no número de interações
    const interactionCount = pattern.interactions.length;
    if (interactionCount > 100) confidence += 0.1;
    if (interactionCount > 500) confidence += 0.1;
    
    // Ajustar baseado na consistência do comportamento
    const consistency = this.calculateBehaviorConsistency(pattern);
    confidence *= consistency;
    
    return Math.min(1.0, confidence);
  }

  // Calcular impacto esperado
  private calculateExpectedImpact(adaptation: any, pattern: UserBehaviorPattern): number {
    const baseImpact = adaptation.weight;
    const skillLevel = pattern.skillLevel;
    
    // Adaptações têm maior impacto em usuários iniciantes
    const skillMultiplier = {
      'BEGINNER': 1.5,
      'INTERMEDIATE': 1.2,
      'ADVANCED': 1.0,
      'EXPERT': 0.8
    };
    
    return baseImpact * skillMultiplier[skillLevel];
  }

  // Calcular consistência do comportamento
  private calculateBehaviorConsistency(pattern: UserBehaviorPattern): number {
    const interactions = pattern.interactions.slice(-50); // Últimas 50 interações
    if (interactions.length < 10) return 0.5;
    
    const avgDuration = interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length;
    const variance = interactions.reduce((sum, i) => sum + Math.pow(i.duration - avgDuration, 2), 0) / interactions.length;
    const stdDev = Math.sqrt(variance);
    
    // Menor desvio padrão = maior consistência
    return Math.max(0.3, Math.min(1.0, 1 - (stdDev / avgDuration)));
  }

  // Obter descrição da adaptação
  private getAdaptationDescription(type: string, pattern: UserBehaviorPattern): string {
    const descriptions: Record<string, string> = {
      'HIDE_ADVANCED_FEATURES': `Ocultar recursos avançados para usuário ${pattern.skillLevel.toLowerCase()}`,
      'SHOW_GUIDED_TOUR': 'Exibir tour guiado para melhorar onboarding',
      'ENABLE_TOOLTIPS': 'Ativar tooltips para reduzir curva de aprendizado',
      'SIMPLIFY_NAVIGATION': 'Simplificar navegação baseado no padrão de uso',
      'SHOW_CONTEXTUAL_HELP': 'Exibir ajuda contextual para reduzir erros',
      'HIGHLIGHT_CORRECT_ACTIONS': 'Destacar ações corretas baseado no histórico de erros',
      'REDUCE_COGNITIVE_LOAD': 'Reduzir carga cognitiva simplificando interface',
      'ENABLE_SHORTCUTS': 'Ativar atalhos de teclado para usuário avançado',
      'SHOW_ADVANCED_FEATURES': 'Exibir recursos avançados para usuário experiente',
      'COMPACT_LAYOUT': 'Usar layout compacto para maximizar eficiência',
      'DISABLE_CONFIRMATIONS': 'Desabilitar confirmações desnecessárias',
      'HIGH_CONTRAST_MODE': 'Ativar modo de alto contraste para acessibilidade',
      'LARGE_FONTS': 'Aumentar tamanho da fonte para melhor legibilidade',
      'KEYBOARD_NAVIGATION': 'Otimizar navegação por teclado',
      'SCREEN_READER_SUPPORT': 'Melhorar suporte a leitores de tela'
    };
    
    return descriptions[type] || `Adaptação ${type} recomendada`;
  }

  // Obter detalhes de implementação
  private getImplementationDetails(type: string, pattern: UserBehaviorPattern): any {
    const implementations: Record<string, any> = {
      'HIDE_ADVANCED_FEATURES': {
        action: 'hideElements',
        selectors: ['.advanced-feature', '.expert-tool'],
        condition: `skillLevel !== 'ADVANCED' && skillLevel !== 'EXPERT'`
      },
      'SHOW_GUIDED_TOUR': {
        action: 'showTour',
        steps: ['dashboard', 'wallets', 'transactions', 'alerts'],
        trigger: 'firstLogin'
      },
      'ENABLE_TOOLTIPS': {
        action: 'enableTooltips',
        elements: 'all',
        delay: 500
      },
      'HIGH_CONTRAST_MODE': {
        action: 'applyTheme',
        theme: 'high-contrast',
        cssClass: 'high-contrast-mode'
      }
    };
    
    return implementations[type] || { action: 'customAdaptation', type };
  }

  // Aplicar adaptação
  private async applyAdaptation(userId: string, recommendation: AdaptiveRecommendation): Promise<void> {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return;

    // Registrar adaptação aplicada
    this.emit('adaptation-applied', {
      userId,
      type: recommendation.type,
      implementation: recommendation.implementation,
      timestamp: Date.now()
    });

    // Atualizar preferências do usuário
    await this.updateUserPreferences(userId, recommendation);
  }

  // Atualizar preferências do usuário
  private async updateUserPreferences(userId: string, recommendation: AdaptiveRecommendation): Promise<void> {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return;

    // Aplicar mudanças nas preferências baseado na recomendação
    switch (recommendation.type) {
      case 'HIGH_CONTRAST_MODE':
        const accessibilityProfile = this.accessibilityProfiles.get(userId) || {} as AccessibilityProfile;
        accessibilityProfile.highContrast = true;
        this.accessibilityProfiles.set(userId, accessibilityProfile);
        break;
        
      case 'COMPACT_LAYOUT':
        pattern.preferences.density = 'compact';
        break;
        
      case 'ENABLE_SHORTCUTS':
        pattern.preferences.shortcuts = true;
        break;
        
      case 'ENABLE_TOOLTIPS':
        pattern.preferences.tooltips = true;
        break;
    }

    this.emit('preferences-updated', { userId, preferences: pattern.preferences });
  }

  // Obter preferências padrão
  private async getDefaultPreferences(): Promise<UserPreferences> {
    return {
      language: 'pt-BR',
      theme: 'auto',
      density: 'comfortable',
      animations: true,
      shortcuts: false,
      tooltips: true,
      notifications: 'important',
      dashboardLayout: ['overview', 'wallets', 'alerts', 'transactions'],
      favoriteFeatures: []
    };
  }

  // Análise contínua de comportamento
  private startBehaviorAnalysis(): void {
    setInterval(() => {
      this.analyzeBehaviorTrends();
    }, 300000); // A cada 5 minutos
  }

  // Analisar tendências de comportamento
  private analyzeBehaviorTrends(): void {
    const allPatterns = Array.from(this.userPatterns.values());
    
    // Calcular padrões globais
    const globalStats = {
      averageSkillLevel: this.calculateAverageSkillLevel(allPatterns),
      commonErrorPatterns: this.identifyCommonErrors(allPatterns),
      popularFeatures: this.identifyPopularFeatures(allPatterns),
      adaptationEffectiveness: this.measureAdaptationEffectiveness(allPatterns)
    };

    this.emit('behavior-trends-analyzed', globalStats);
  }

  // Calcular nível médio de habilidade
  private calculateAverageSkillLevel(patterns: UserBehaviorPattern[]): number {
    const skillValues = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3, 'EXPERT': 4 };
    const total = patterns.reduce((sum, p) => sum + skillValues[p.skillLevel], 0);
    return patterns.length > 0 ? total / patterns.length : 1;
  }

  // Identificar erros comuns
  private identifyCommonErrors(patterns: UserBehaviorPattern[]): string[] {
    const errorMap = new Map<string, number>();
    
    for (const pattern of patterns) {
      for (const interaction of pattern.interactions) {
        if (interaction.errorCount > 0) {
          const key = `${interaction.action}_${interaction.element}`;
          errorMap.set(key, (errorMap.get(key) || 0) + interaction.errorCount);
        }
      }
    }
    
    return Array.from(errorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key]) => key);
  }

  // Identificar recursos populares
  private identifyPopularFeatures(patterns: UserBehaviorPattern[]): string[] {
    const featureMap = new Map<string, number>();
    
    for (const pattern of patterns) {
      for (const interaction of pattern.interactions) {
        featureMap.set(interaction.element, (featureMap.get(interaction.element) || 0) + 1);
      }
    }
    
    return Array.from(featureMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key]) => key);
  }

  // Medir efetividade das adaptações
  private measureAdaptationEffectiveness(patterns: UserBehaviorPattern[]): number {
    const totalScore = patterns.reduce((sum, p) => sum + p.adaptationScore, 0);
    return patterns.length > 0 ? totalScore / patterns.length : 0;
  }

  // API pública para obter recomendações
  async getAdaptationRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    return await this.analyzeAndAdapt(userId);
  }

  // API pública para definir perfil de acessibilidade
  setAccessibilityProfile(userId: string, profile: AccessibilityProfile): void {
    this.accessibilityProfiles.set(userId, profile);
    this.emit('accessibility-profile-updated', { userId, profile });
  }

  // API pública para obter estatísticas do usuário
  getUserStats(userId: string) {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return null;

    return {
      skillLevel: pattern.skillLevel,
      adaptationScore: pattern.adaptationScore,
      totalInteractions: pattern.interactions.length,
      errorRate: this.calculateErrorRate(pattern),
      featureUsage: this.calculateFeatureUsage(pattern),
      preferences: pattern.preferences
    };
  }
}

export const adaptiveUXEngine = new AdaptiveUXEngine();