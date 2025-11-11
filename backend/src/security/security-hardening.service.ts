import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export class SecurityHardeningService {

  // Rate limiting avançado
  static createAdvancedRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por IP
      message: { error: 'Too many requests, please try again later' },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, userAgent: req.get('User-Agent') });
        res.status(429).json({ error: 'Rate limit exceeded' });
      }
    });
  }

  // Helmet configuração de segurança
  static getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  // Middleware de validação de input
  static inputSanitization(req: Request, res: Response, next: NextFunction) {
    // Sanitizar inputs
    if (req.body) {
      req.body = SecurityHardeningService.sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = SecurityHardeningService.sanitizeObject(req.query);
    }
    if (req.params) {
      req.params = SecurityHardeningService.sanitizeObject(req.params);
    }
    next();
  }

  private static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityHardeningService.sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = SecurityHardeningService.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private static sanitizeString(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // Middleware de detecção de ataques
  static attackDetection(req: Request, res: Response, next: NextFunction) {
    const suspiciousPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection
      /(\%3C)|(<)|(\%3E)|(>)/i, // XSS
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, // SQL Injection
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, // SQL Injection
      /((\%27)|(\'))union/i, // Union-based SQL Injection
      /exec(\s|\+)+(s|x)p\w+/i // Stored procedure execution
    ];

    const userAgent = req.get('User-Agent') || '';
    const url = req.url;
    const body = JSON.stringify(req.body);

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url) || pattern.test(body) || pattern.test(userAgent)) {
        logger.error('Suspicious request detected', {
          ip: req.ip,
          userAgent,
          url,
          pattern: pattern.toString()
        });
        return res.status(403).json({ error: 'Suspicious request blocked' });
      }
    }

    next();
  }

  // Middleware de proteção CSRF
  static csrfProtection(req: Request, res: Response, next: NextFunction) {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = req.headers['x-csrf-token'] as string;
      const sessionToken = req.session?.csrfToken;

      if (!token || !sessionToken || token !== sessionToken) {
        return res.status(403).json({ error: 'CSRF token mismatch' });
      }
    }
    next();
  }

  // Geração de token CSRF
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Middleware de log de segurança
  static securityLogging(req: Request, res: Response, next: NextFunction) {
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };

    Object.entries(securityHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });

    // Log de requisições sensíveis
    if (req.path.includes('/admin') || req.path.includes('/api/keys')) {
      logger.info('Sensitive endpoint accessed', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        userId: (req as any).userId
      });
    }

    next();
  }

  // Validação de força de senha
  static validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Verificar padrões comuns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i
    ];
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Password contains common patterns');
    }

    return { valid: errors.length === 0, errors };
  }

  // Middleware de timeout de sessão
  static sessionTimeout(timeoutMs: number = 30 * 60 * 1000) { // 30 minutos
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.session) {
        const now = Date.now();
        const lastActivity = req.session.lastActivity || now;
        
        if (now - lastActivity > timeoutMs) {
          req.session.destroy((err) => {
            if (err) logger.error('Session destruction error', { error: err });
          });
          return res.status(401).json({ error: 'Session expired' });
        }
        
        req.session.lastActivity = now;
      }
      next();
    };
  }

  // Detecção de IP suspeito
  static suspiciousIPDetection(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    
    // Lista de IPs conhecidos maliciosos (exemplo)
    const maliciousIPs = new Set([
      '192.168.1.100', // Exemplo
      '10.0.0.50'      // Exemplo
    ]);
    
    if (maliciousIPs.has(ip)) {
      logger.error('Malicious IP detected', { ip, userAgent: req.get('User-Agent') });
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Verificar se IP está em range privado em produção
    if (process.env.NODE_ENV === 'production') {
      const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2\d|3[01])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./
      ];
      
      if (privateRanges.some(range => range.test(ip))) {
        logger.warn('Private IP in production', { ip });
      }
    }
    
    next();
  }
}

export const securityHardening = SecurityHardeningService;