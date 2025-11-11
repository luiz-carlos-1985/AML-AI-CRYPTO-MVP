import express from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { securityScanner } from '../services/security-scanner.service';
import { logger } from '../utils/logger';
import prisma from '../utils/prisma';

const router = express.Router();

// Get security dashboard data
router.get('/dashboard', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    // Get latest scan results
    const latestScan = await prisma.securityScan.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    // Get recent security incidents
    const recentIncidents = await prisma.securityIncident.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });

    // Get security metrics
    const metrics = latestScan ? JSON.parse(latestScan.metrics) : {
      authentication: 0,
      encryption: 0,
      accessControl: 0,
      monitoring: 0,
      compliance: 0,
      networkSecurity: 0
    };

    // Get compliance status
    const complianceStatus = latestScan ? JSON.parse(latestScan.complianceStatus) : {
      iso27001: false,
      soc2: false,
      pciDss: false,
      gdpr: false,
      lgpd: false
    };

    res.json({
      overallScore: latestScan?.overallScore || 0,
      metrics,
      complianceStatus,
      recentIncidents: recentIncidents.map(incident => ({
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        timestamp: incident.timestamp,
        resolved: incident.resolved
      })),
      lastScanTime: latestScan?.timestamp || null,
      vulnerabilityCount: latestScan ? JSON.parse(latestScan.vulnerabilities).length : 0
    });
  } catch (error) {
    logger.error('Failed to get security dashboard data', { error });
    res.status(500).json({ error: 'Failed to load security dashboard' });
  }
});

// Run comprehensive security scan
router.post('/scan', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    logger.info('Starting security scan', { userId: req.userId });

    // Run the scan asynchronously
    const scanPromise = securityScanner.performComprehensiveScan();
    
    // Return scan ID immediately
    res.json({
      message: 'Security scan started',
      scanId: 'scan-' + Date.now(),
      estimatedDuration: '3-5 minutes'
    });

    // Continue scan in background
    try {
      const results = await scanPromise;
      logger.info('Security scan completed', {
        scanId: results.scanId,
        overallScore: results.overallScore,
        vulnerabilities: results.vulnerabilities.length
      });

      // Notify about critical vulnerabilities
      const criticalVulns = results.vulnerabilities.filter(v => v.type === 'CRITICAL');
      if (criticalVulns.length > 0) {
        await notifySecurityTeam(criticalVulns);
      }
    } catch (scanError) {
      logger.error('Security scan failed', { error: scanError });
    }
  } catch (error) {
    logger.error('Failed to start security scan', { error });
    res.status(500).json({ error: 'Failed to start security scan' });
  }
});

// Get scan results
router.get('/scan/:scanId', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { scanId } = req.params;

    const scan = await prisma.securityScan.findUnique({
      where: { scanId }
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({
      scanId: scan.scanId,
      timestamp: scan.timestamp,
      overallScore: scan.overallScore,
      vulnerabilities: JSON.parse(scan.vulnerabilities),
      metrics: JSON.parse(scan.metrics),
      complianceStatus: JSON.parse(scan.complianceStatus)
    });
  } catch (error) {
    logger.error('Failed to get scan results', { error });
    res.status(500).json({ error: 'Failed to get scan results' });
  }
});

// Get all vulnerabilities
router.get('/vulnerabilities', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { severity, category, status = 'open' } = req.query;

    // Get latest scan
    const latestScan = await prisma.securityScan.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    if (!latestScan) {
      return res.json({ vulnerabilities: [] });
    }

    let vulnerabilities = JSON.parse(latestScan.vulnerabilities);

    // Apply filters
    if (severity) {
      vulnerabilities = vulnerabilities.filter((v: any) => v.type === severity);
    }

    if (category) {
      vulnerabilities = vulnerabilities.filter((v: any) => v.category === category);
    }

    res.json({
      vulnerabilities,
      scanId: latestScan.scanId,
      scanTime: latestScan.timestamp
    });
  } catch (error) {
    logger.error('Failed to get vulnerabilities', { error });
    res.status(500).json({ error: 'Failed to get vulnerabilities' });
  }
});

// Mark vulnerability as resolved
router.patch('/vulnerabilities/:vulnId/resolve', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { vulnId } = req.params;
    const { resolution, notes } = req.body;

    // Log the resolution
    await prisma.securityIncident.create({
      data: {
        type: 'VULNERABILITY_RESOLVED',
        description: `Vulnerability ${vulnId} resolved: ${resolution}`,
        severity: 'INFO',
        metadata: JSON.stringify({
          vulnerabilityId: vulnId,
          resolution,
          notes,
          resolvedBy: req.userId
        })
      }
    });

    logger.info('Vulnerability resolved', {
      vulnId,
      resolution,
      resolvedBy: req.userId
    });

    res.json({ message: 'Vulnerability marked as resolved' });
  } catch (error) {
    logger.error('Failed to resolve vulnerability', { error });
    res.status(500).json({ error: 'Failed to resolve vulnerability' });
  }
});

// Get security incidents
router.get('/incidents', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { severity, type, resolved, limit = 50 } = req.query;

    const where: any = {};

    if (severity) where.severity = severity;
    if (type) where.type = type;
    if (resolved !== undefined) where.resolved = resolved === 'true';

    const incidents = await prisma.securityIncident.findMany({
      where,
      take: parseInt(limit as string),
      orderBy: { timestamp: 'desc' }
    });

    res.json({ incidents });
  } catch (error) {
    logger.error('Failed to get security incidents', { error });
    res.status(500).json({ error: 'Failed to get security incidents' });
  }
});

// Create security incident
router.post('/incidents', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { type, description, severity, metadata } = req.body;

    const incident = await prisma.securityIncident.create({
      data: {
        type,
        description,
        severity,
        metadata: JSON.stringify(metadata || {}),
        reportedBy: req.userId
      }
    });

    logger.info('Security incident created', {
      incidentId: incident.id,
      type,
      severity,
      reportedBy: req.userId
    });

    res.status(201).json({ incident });
  } catch (error) {
    logger.error('Failed to create security incident', { error });
    res.status(500).json({ error: 'Failed to create security incident' });
  }
});

// Update incident status
router.patch('/incidents/:incidentId', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { resolved, resolution } = req.body;

    const incident = await prisma.securityIncident.update({
      where: { id: incidentId },
      data: {
        resolved,
        resolution,
        resolvedAt: resolved ? new Date() : null,
        resolvedBy: resolved ? req.userId : null
      }
    });

    logger.info('Security incident updated', {
      incidentId,
      resolved,
      updatedBy: req.userId
    });

    res.json({ incident });
  } catch (error) {
    logger.error('Failed to update security incident', { error });
    res.status(500).json({ error: 'Failed to update security incident' });
  }
});

// Get compliance report
router.get('/compliance/report', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { standard } = req.query; // iso27001, soc2, pciDss, etc.

    // Get latest scan for compliance status
    const latestScan = await prisma.securityScan.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    if (!latestScan) {
      return res.status(404).json({ error: 'No security scan data available' });
    }

    const complianceStatus = JSON.parse(latestScan.complianceStatus);
    const vulnerabilities = JSON.parse(latestScan.vulnerabilities);
    const metrics = JSON.parse(latestScan.metrics);

    // Generate compliance report based on standard
    const report = generateComplianceReport(standard as string, {
      complianceStatus,
      vulnerabilities,
      metrics,
      scanTime: latestScan.timestamp
    });

    res.json(report);
  } catch (error) {
    logger.error('Failed to generate compliance report', { error });
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

// Security metrics endpoint
router.get('/metrics', authenticate, requireRole(['ADMIN', 'SECURITY_OFFICER']), async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;

    const timeRangeMs = parseTimeRange(timeRange as string);
    const startTime = new Date(Date.now() - timeRangeMs);

    // Get security metrics for the time range
    const incidents = await prisma.securityIncident.findMany({
      where: {
        timestamp: { gte: startTime }
      }
    });

    const scans = await prisma.securityScan.findMany({
      where: {
        timestamp: { gte: startTime }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Calculate metrics
    const metrics = {
      totalIncidents: incidents.length,
      criticalIncidents: incidents.filter(i => i.severity === 'CRITICAL').length,
      resolvedIncidents: incidents.filter(i => i.resolved).length,
      averageResolutionTime: calculateAverageResolutionTime(incidents),
      securityScoreTrend: scans.map(s => ({
        timestamp: s.timestamp,
        score: s.overallScore
      })),
      vulnerabilityTrend: scans.map(s => ({
        timestamp: s.timestamp,
        count: JSON.parse(s.vulnerabilities).length
      }))
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Failed to get security metrics', { error });
    res.status(500).json({ error: 'Failed to get security metrics' });
  }
});

// Helper functions
async function notifySecurityTeam(vulnerabilities: any[]): Promise<void> {
  // Implementation for notifying security team about critical vulnerabilities
  logger.warn('Critical vulnerabilities detected', {
    count: vulnerabilities.length,
    vulnerabilities: vulnerabilities.map(v => ({ id: v.id, title: v.title, type: v.type }))
  });

  // Here you would implement actual notification logic:
  // - Send emails to security team
  // - Create Slack notifications
  // - Trigger incident response procedures
}

function generateComplianceReport(standard: string, data: any): any {
  const baseReport = {
    standard,
    generatedAt: new Date().toISOString(),
    overallCompliance: data.complianceStatus[standard] || false,
    lastAssessment: data.scanTime,
    ...data
  };

  switch (standard) {
    case 'iso27001':
      return {
        ...baseReport,
        requirements: {
          informationSecurityPolicy: data.complianceStatus.iso27001,
          riskManagement: data.metrics.accessControl >= 80,
          accessControl: data.metrics.accessControl >= 85,
          cryptography: data.metrics.encryption >= 90,
          physicalSecurity: true, // Would be assessed separately
          operationsSecurity: data.metrics.monitoring >= 80,
          communicationsSecurity: data.metrics.networkSecurity >= 85,
          systemAcquisition: true,
          supplierRelationships: true,
          incidentManagement: data.vulnerabilities.filter((v: any) => v.type === 'CRITICAL').length === 0,
          businessContinuity: true,
          compliance: data.complianceStatus.iso27001
        }
      };

    case 'soc2':
      return {
        ...baseReport,
        trustServicesCriteria: {
          security: data.metrics.accessControl >= 80 && data.metrics.encryption >= 80,
          availability: data.metrics.monitoring >= 85,
          processingIntegrity: data.vulnerabilities.filter((v: any) => v.category === 'Input Validation').length === 0,
          confidentiality: data.metrics.encryption >= 90,
          privacy: data.vulnerabilities.filter((v: any) => v.category === 'Data Protection').length === 0
        }
      };

    default:
      return baseReport;
  }
}

function parseTimeRange(timeRange: string): number {
  const ranges: { [key: string]: number } = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };

  return ranges[timeRange] || ranges['24h'];
}

function calculateAverageResolutionTime(incidents: any[]): number {
  const resolvedIncidents = incidents.filter(i => i.resolved && i.resolvedAt);
  
  if (resolvedIncidents.length === 0) return 0;

  const totalTime = resolvedIncidents.reduce((sum, incident) => {
    const resolutionTime = new Date(incident.resolvedAt).getTime() - new Date(incident.timestamp).getTime();
    return sum + resolutionTime;
  }, 0);

  return Math.round(totalTime / resolvedIncidents.length / (60 * 1000)); // Return in minutes
}

export default router;