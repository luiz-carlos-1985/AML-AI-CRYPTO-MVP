import { useEffect, useCallback } from 'react';
import { revolutionaryApi } from '../services/revolutionaryApi';

// Hook para registrar interações do usuário automaticamente
export const useRevolutionary = () => {
  const sessionId = sessionStorage.getItem('sessionId') || Date.now().toString();

  // Registrar interação do usuário
  const recordInteraction = useCallback(async (
    action: string,
    element: string,
    options?: {
      duration?: number;
      success?: boolean;
      errorCount?: number;
      helpRequested?: boolean;
      context?: any;
    }
  ) => {
    try {
      await revolutionaryApi.recordUserInteraction({
        sessionId,
        action,
        element,
        duration: options?.duration || 0,
        success: options?.success !== false,
        errorCount: options?.errorCount || 0,
        helpRequested: options?.helpRequested || false,
        context: options?.context || {}
      });
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  }, [sessionId]);

  // Auto-registrar cliques
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.tagName.toLowerCase();
      const id = target.id || target.className || 'unknown';
      
      recordInteraction('CLICK', `${element}:${id}`, {
        context: {
          x: event.clientX,
          y: event.clientY,
          timestamp: Date.now()
        }
      });
    };

    // Auto-registrar tempo de permanência na página
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const duration = Date.now() - startTime;
      recordInteraction('PAGE_VIEW', window.location.pathname, {
        duration,
        success: true
      });
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [recordInteraction]);

  return {
    recordInteraction,
    sessionId
  };
};

// Hook para obter recomendações adaptativas
export const useAdaptiveRecommendations = () => {
  const getRecommendations = useCallback(async () => {
    try {
      const response = await revolutionaryApi.getAdaptiveRecommendations();
      return response;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    }
  }, []);

  return { getRecommendations };
};

// Hook para performance quântica
export const useQuantumPerformance = () => {
  const getStats = useCallback(async () => {
    try {
      const response = await revolutionaryApi.getQuantumPerformanceStats();
      return response;
    } catch (error) {
      console.error('Error getting performance stats:', error);
      return null;
    }
  }, []);

  const optimizeCache = useCallback(async (operation: 'clear' | 'preload', cacheKey?: string) => {
    try {
      const response = await revolutionaryApi.optimizeQuantumCache({
        operation,
        cacheKey
      });
      return response;
    } catch (error) {
      console.error('Error optimizing cache:', error);
      return null;
    }
  }, []);

  return { getStats, optimizeCache };
};