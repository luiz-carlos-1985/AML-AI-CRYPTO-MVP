import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';
import {
  runQuantumCompliance,
  getTransparencyAuditTrail,
  exportTransparencyReport,
  getQuantumPerformanceStats,
  optimizeQuantumCache,
  recordUserInteraction,
  getAdaptiveRecommendations,
  setAccessibilityProfile,
  getPredictiveInsights,
  getRevolutionaryDashboard
} from '../controllers/revolutionary-features.controller';

const router = Router();

// Rate limiting para funcionalidades revolucionárias
const revolutionaryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // 50 requests por IP
  message: { error: 'Too many revolutionary requests, please try again later' }
});

const intensiveRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // 10 requests por IP para operações intensivas
  message: { error: 'Too many intensive operations, please try again later' }
});

// 🚀 QUANTUM COMPLIANCE ROUTES
router.post('/quantum-compliance/analyze', 
  auth, 
  revolutionaryRateLimit,
  runQuantumCompliance
);

// 🔗 TRANSPARENCY BLOCKCHAIN ROUTES
router.get('/transparency/audit-trail', 
  auth, 
  revolutionaryRateLimit,
  getTransparencyAuditTrail
);

router.get('/transparency/export', 
  auth, 
  intensiveRateLimit,
  exportTransparencyReport
);

// ⚡ QUANTUM PERFORMANCE ROUTES
router.get('/quantum-performance/stats', 
  auth, 
  revolutionaryRateLimit,
  getQuantumPerformanceStats
);

router.post('/quantum-performance/optimize-cache', 
  auth, 
  intensiveRateLimit,
  optimizeQuantumCache
);

// 🎨 ADAPTIVE UX ROUTES
router.post('/adaptive-ux/interaction', 
  auth, 
  revolutionaryRateLimit,
  recordUserInteraction
);

router.get('/adaptive-ux/recommendations', 
  auth, 
  revolutionaryRateLimit,
  getAdaptiveRecommendations
);

router.post('/adaptive-ux/accessibility-profile', 
  auth, 
  revolutionaryRateLimit,
  setAccessibilityProfile
);

// 🔮 PREDICTIVE ANALYTICS ROUTES
router.get('/predictive/insights', 
  auth, 
  intensiveRateLimit,
  getPredictiveInsights
);

// 🌟 REVOLUTIONARY DASHBOARD ROUTE
router.get('/dashboard/revolutionary', 
  auth, 
  revolutionaryRateLimit,
  getRevolutionaryDashboard
);

export default router;