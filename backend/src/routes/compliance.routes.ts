import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { lgpdMiddleware, requireLGPDConsent } from '../middleware/lgpd.middleware';
import {
  generateCOAFReport,
  generateBACENReport,
  handleDataSubjectRequest,
  logSecurityIncident
} from '../controllers/compliance.controller';

const router = Router();

// Apply LGPD middleware to all routes
router.use(lgpdMiddleware);
router.use(authenticate);

// COAF - Comunicação de Operações Suspeitas
router.get('/coaf/report', requireRole(['ADMIN', 'COMPLIANCE_OFFICER']), generateCOAFReport);

// BACEN - Relatórios de Controles Internos
router.get('/bacen/report', requireRole(['ADMIN', 'COMPLIANCE_OFFICER']), generateBACENReport);

// LGPD - Data Subject Rights
router.post('/lgpd/data-request', handleDataSubjectRequest);

// ISO 27001 - Security Incident Reporting
router.post('/security/incident', logSecurityIncident);

export default router;