import { Request, Response, NextFunction } from 'express';
import { advancedSecurity } from '../services/advanced-security.service';
import { quantumEncryption } from '../services/quantum-encryption.service';
import { logger } from '../utils/logger';
import prisma from '../utils/prisma';
import { t, detectLanguage } from '../i18n/translations';

// Interface estendida para Request com dados de segurança
interface SecureRequest extends Request {
  securityContext?: {
    fingerprint: string;
    riskScore: number;
    behaviorFlags: string[];
    encryptionLevel: string;
    sessionId: string;
  };
  quantumEncrypted?: boolean;
}

// Middleware de validação de integridade do sistema
export const systemIntegrityMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = await advancedSecurity.validateSystemIntegrity();
    
    if (!isValid) {
      logger.error('CRITICAL: System integrity violation detected');
      const lang = detectLanguage(req.get('Accept-Language'));
      return res.status(503).json({
        error: t('security.systemIntegrityViolation', lang),
        code: 'INTEGRITY_VIOLATION',
        message: t('security.systemIntegrityViolation', lang)
      });
    }

    next();
  } catch (error) {
    logger.error('System integrity check failed', { error });
    return res.status(500).json({
      error: 'Security validation failed',
      code: 'SECURITY_ERROR'
    });
  }
};

// Middleware de análise comportamental em tempo real
export const behavioralAnalysisMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return next(); // Pular se não autenticado
    }

    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method,
      path: req.path,
      timestamp: Date.now()
    };

    const riskScore = await advancedSecurity.analyzeBehavioralPattern(
      userId,
      `${req.method}:${req.path}`,
      metadata
    );

    // Adicionar contexto de segurança à requisição
    req.securityContext = {
      fingerprint: await generateRequestFingerprint(req),
      riskScore,
      behaviorFlags: await getBehaviorFlags(riskScore),
      encryptionLevel: determineEncryptionLevel(riskScore),
      sessionId: generateSessionId(req)
    };

    // Bloquear requisições de alto risco
    if (riskScore > 80) {
      logger.warn('High-risk request blocked', {
        userId,
        riskScore,
        metadata
      });

      await logSecurityEvent('HIGH_RISK_REQUEST_BLOCKED', {
        userId,
        riskScore,
        metadata
      });

      const lang = detectLanguage(req.get('Accept-Language'));
      return res.status(429).json({
        error: t('security.highRiskRequestBlocked', lang),
        code: 'HIGH_RISK_BLOCKED',
        riskScore
      });
    }

    // Aplicar medidas de segurança baseadas no risco
    if (riskScore > 50) {
      // Adicionar delay para requisições suspeitas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar para criptografia quântica
      req.quantumEncrypted = true;
    }

    next();
  } catch (error) {
    logger.error('Behavioral analysis failed', { error });
    next(); // Continuar em caso de erro
  }
};

// Middleware de proteção anti-bot avançada
export const advancedAntiBotMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAgent = req.get('User-Agent') || '';
    const fingerprint = await generateRequestFingerprint(req);
    
    // Verificar padrões de bot
    const botScore = await calculateBotScore(req);
    
    if (botScore > 0.8) {
      logger.warn('Bot detected and blocked', {
        userAgent,
        fingerprint,
        botScore,
        ip: req.ip
      });

      await logSecurityEvent('BOT_DETECTED', {
        userAgent,
        fingerprint,
        botScore,
        ip: req.ip
      });

      const lang = detectLanguage(req.get('Accept-Language'));
      return res.status(403).json({
        error: t('security.botDetected', lang),
        code: 'BOT_DETECTED'
      });
    }

    // Aplicar rate limiting dinâmico baseado no score
    if (botScore > 0.5) {
      await applyDynamicRateLimit(req, res, botScore);
    }

    next();
  } catch (error) {
    logger.error('Anti-bot middleware failed', { error });
    next();
  }
};

// Middleware de criptografia quântica para dados sensíveis
export const quantumEncryptionMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Interceptar resposta para criptografar dados sensíveis
    const originalSend = res.send;
    
    res.send = function(data: any) {
      if (req.quantumEncrypted && shouldEncryptResponse(req.path)) {
        try {
          const encryptedData = quantumEncryption.encryptWithQuantumResistance(
            JSON.stringify(data)
          );
          
          res.setHeader('X-Quantum-Encrypted', 'true');
          res.setHeader('X-Encryption-Algorithm', 'HYBRID_QUANTUM_RESISTANT');
          
          return originalSend.call(this, {
            encrypted: true,
            data: encryptedData
          });
        } catch (error) {
          logger.error('Quantum encryption failed', { error });
          return originalSend.call(this, data);
        }
      }
      
      return originalSend.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Quantum encryption middleware failed', { error });
    next();
  }
};

// Middleware de watermarking de dados
export const dataWatermarkingMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return next();
    }

    // Interceptar resposta para adicionar watermark
    const originalJson = res.json;
    
    res.json = function(data: any) {
      if (shouldWatermarkData(req.path, data)) {
        const watermarkedData = advancedSecurity.addDataWatermark(data, userId);
        return originalJson.call(this, watermarkedData);
      }
      
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    logger.error('Data watermarking failed', { error });
    next();
  }
};

// Middleware de validação de licença
export const licenseValidationMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar licença do sistema periodicamente
    const shouldValidate = Math.random() < 0.01; // 1% das requisições
    
    if (shouldValidate) {
      const license = process.env.SYSTEM_LICENSE;
      if (!license) {
        logger.error('System license not found');
        return res.status(503).json({
          error: 'System license validation failed',
          code: 'LICENSE_ERROR'
        });
      }

      const isValid = advancedSecurity.validateSystemLicense(license);
      if (!isValid) {
        logger.error('Invalid system license detected');
        const lang = detectLanguage(req.get('Accept-Language'));
        return res.status(503).json({
          error: t('security.invalidLicense', lang),
          code: 'INVALID_LICENSE'
        });
      }
    }

    next();
  } catch (error) {
    logger.error('License validation failed', { error });
    next();
  }
};

// Middleware de detecção de clonagem
export const cloneDetectionMiddleware = async (
  req: SecureRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const systemFingerprint = await getSystemFingerprint();
    const requestFingerprint = await generateRequestFingerprint(req);
    
    // Verificar se a requisição vem de um sistema clonado
    const cloneScore = await calculateCloneScore(req, systemFingerprint);
    
    if (cloneScore > 0.8) {
      logger.error('Potential system clone detected', {
        cloneScore,
        requestFingerprint,
        ip: req.ip
      });

      await logSecurityEvent('CLONE_DETECTED', {
        cloneScore,
        requestFingerprint,
        ip: req.ip
      });

      const lang = detectLanguage(req.get('Accept-Language'));
      return res.status(403).json({
        error: t('security.cloneDetected', lang),
        code: 'CLONE_DETECTED'
      });
    }

    next();
  } catch (error) {
    logger.error('Clone detection failed', { error });
    next();
  }
};

// Funções auxiliares
async function generateRequestFingerprint(req: Request): Promise<string> {
  const factors = [
    req.ip,
    req.get('User-Agent'),
    req.get('Accept-Language'),
    req.get('Accept-Encoding'),
    Object.keys(req.headers).sort().join(',')
  ];
  
  const crypto = require('crypto');
  return crypto.createHash('sha256')
    .update(factors.join('|'))
    .digest('hex')
    .substring(0, 16);
}

async function getBehaviorFlags(riskScore: number): Promise<string[]> {
  const flags: string[] = [];
  
  if (riskScore > 70) flags.push('HIGH_RISK');
  if (riskScore > 50) flags.push('SUSPICIOUS');
  if (riskScore > 30) flags.push('MONITOR');
  
  return flags;
}

function determineEncryptionLevel(riskScore: number): string {
  if (riskScore > 70) return 'QUANTUM_RESISTANT';
  if (riskScore > 50) return 'ENHANCED';
  return 'STANDARD';
}

function generateSessionId(req: Request): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('hex');
}

async function calculateBotScore(req: Request): Promise<number> {
  let score = 0;
  const userAgent = req.get('User-Agent') || '';
  
  // Verificar padrões conhecidos de bot
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /postman/i,
    /automated/i, /script/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    score += 0.6;
  }
  
  // Verificar ausência de headers comuns de browser
  if (!req.get('Accept-Language')) score += 0.2;
  if (!req.get('Accept-Encoding')) score += 0.2;
  if (!req.get('Connection')) score += 0.1;
  
  // Verificar frequência de requisições
  const recentRequests = await getRecentRequestCount(req.ip);
  if (recentRequests > 100) score += 0.3;
  
  return Math.min(score, 1);
}

async function applyDynamicRateLimit(req: Request, res: Response, botScore: number): Promise<void> {
  const delay = Math.floor(botScore * 2000); // Até 2 segundos de delay
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

function shouldEncryptResponse(path: string): boolean {
  const sensitiveEndpoints = [
    '/api/wallets',
    '/api/transactions',
    '/api/reports',
    '/api/auth/profile'
  ];
  
  return sensitiveEndpoints.some(endpoint => path.startsWith(endpoint));
}

function shouldWatermarkData(path: string, data: any): boolean {
  // Aplicar watermark em dados de transações e relatórios
  return path.includes('/transactions') || 
         path.includes('/reports') || 
         (data && Array.isArray(data));
}

async function getSystemFingerprint(): Promise<string> {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'system_fingerprint' }
    });
    return config?.value || '';
  } catch (error) {
    return '';
  }
}

async function calculateCloneScore(req: Request, systemFingerprint: string): Promise<number> {
  // Implementar lógica de detecção de clonagem
  // Verificar se headers/comportamento indicam sistema clonado
  return 0; // Placeholder
}

async function getRecentRequestCount(ip: string): Promise<number> {
  try {
    const count = await prisma.auditLog.count({
      where: {
        ipAddress: ip,
        timestamp: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Última hora
        }
      }
    });
    return count;
  } catch (error) {
    return 0;
  }
}

async function logSecurityEvent(type: string, metadata: any): Promise<void> {
  try {
    await prisma.securityIncident.create({
      data: {
        type,
        description: `Security event: ${type}`,
        metadata: JSON.stringify(metadata),
        severity: 'HIGH'
      }
    });
  } catch (error) {
    logger.error('Failed to log security event', { error, type });
  }
}