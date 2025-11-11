import { Router } from 'express';
import { advancedComplianceController } from '../controllers/advanced-compliance.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireRole } from '../middleware/admin';
// import { 
//   systemIntegrityMiddleware,
//   behavioralAnalysisMiddleware,
//   advancedAntiBotMiddleware,
//   quantumEncryptionMiddleware,
//   dataWatermarkingMiddleware,
//   licenseValidationMiddleware,
//   cloneDetectionMiddleware
// } from '../middleware/advanced-security.middleware';
import { lgpdMiddleware } from '../middleware/lgpd.middleware';
import { auditMiddleware } from '../middleware/audit.middleware';

const router = Router();

// Aplicar middlewares básicos
router.use(lgpdMiddleware);
router.use(auditMiddleware);

// Rotas de análise com IA
router.post('/ai/analyze/transaction/:transactionId',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.analyzeTransactionWithAI(req, res)
);

router.get('/intelligence/address/:address/:blockchain',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.analyzeAddressIntelligence(req, res)
);

// Rotas de relatórios regulatórios
router.get('/reports/coaf',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.generateCOAFReport(req, res)
);

router.get('/reports/bacen',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.generateBACENReport(req, res)
);

// Rotas de validação de compliance
router.post('/validate/:entityType/:entityId',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.validateCompliance(req, res)
);

// Rotas de criptografia quântica
router.post('/quantum/encrypt',
  authenticateToken,
  requireRole(['ADMIN']),
  (req, res) => advancedComplianceController.encryptSensitiveData(req, res)
);

// Dashboard de compliance
router.get('/dashboard',
  authenticateToken,
  requireRole(['ADMIN', 'COMPLIANCE_OFFICER']),
  (req, res) => advancedComplianceController.getComplianceDashboard(req, res)
);

export default router;