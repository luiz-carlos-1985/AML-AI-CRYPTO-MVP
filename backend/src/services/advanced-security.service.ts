import crypto from 'crypto';
import { Request } from 'express';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

// Sistema de Fingerprinting Único - Dificulta clonagem
export class AdvancedSecurityService {
  private static instance: AdvancedSecurityService;
  private readonly systemFingerprint: string;
  private readonly encryptionKey: Buffer;

  constructor() {
    // Gera fingerprint único do sistema baseado em múltiplos fatores
    this.systemFingerprint = this.generateSystemFingerprint();
    this.encryptionKey = Buffer.from(process.env.SYSTEM_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');
  }

  static getInstance(): AdvancedSecurityService {
    if (!AdvancedSecurityService.instance) {
      AdvancedSecurityService.instance = new AdvancedSecurityService();
    }
    return AdvancedSecurityService.instance;
  }

  // Gera fingerprint único baseado em características do sistema
  private generateSystemFingerprint(): string {
    const factors = [
      process.env.DATABASE_URL?.slice(-20),
      process.env.JWT_SECRET?.slice(0, 10),
      process.env.WALLET_ENCRYPTION_KEY?.slice(0, 10),
      new Date().getFullYear().toString(),
      'CRYPTOAML_UNIQUE_2024'
    ];
    
    return crypto.createHash('sha256')
      .update(factors.join('|'))
      .digest('hex')
      .substring(0, 32);
  }

  // Validação de integridade do sistema
  async validateSystemIntegrity(): Promise<boolean> {
    try {
      const storedFingerprint = await this.getStoredFingerprint();
      const currentFingerprint = this.generateSystemFingerprint();
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        logger.error('SECURITY ALERT: System fingerprint mismatch detected');
        await this.logSecurityIncident('SYSTEM_INTEGRITY_VIOLATION', 'Fingerprint mismatch');
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('System integrity validation failed', { error });
      return false;
    }
  }

  // Criptografia avançada para dados sensíveis
  encryptSensitiveData(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', this.encryptionKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  // Descriptografia de dados sensíveis
  decryptSensitiveData(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipher('aes-256-gcm', this.encryptionKey);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Análise comportamental avançada
  async analyzeBehavioralPattern(userId: string, action: string, metadata: any): Promise<number> {
    try {
      const recentActions = await prisma.auditLog.findMany({
        where: {
          userId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      });

      let riskScore = 0;

      // Análise de frequência
      const actionCount = recentActions.filter(log => log.action === action).length;
      if (actionCount > 50) riskScore += 30;
      else if (actionCount > 20) riskScore += 15;

      // Análise de horário (atividade fora do horário comercial)
      const hour = new Date().getHours();
      if (hour < 6 || hour > 22) riskScore += 10;

      // Análise de geolocalização (se disponível)
      if (metadata.ipAddress) {
        const suspiciousIPs = await this.checkSuspiciousIP(metadata.ipAddress);
        if (suspiciousIPs) riskScore += 25;
      }

      // Análise de padrão de User-Agent
      if (metadata.userAgent) {
        const isBot = this.detectBotPattern(metadata.userAgent);
        if (isBot) riskScore += 20;
      }

      return Math.min(riskScore, 100);
    } catch (error) {
      logger.error('Behavioral analysis failed', { error, userId, action });
      return 0;
    }
  }

  // Detecção de padrões de bot
  private detectBotPattern(userAgent: string): boolean {
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /postman/i
    ];
    
    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  // Verificação de IP suspeito
  private async checkSuspiciousIP(ipAddress: string): Promise<boolean> {
    // Lista de IPs conhecidos suspeitos (Tor, VPN, etc.)
    const suspiciousRanges = [
      '10.0.0.0/8',    // Private networks
      '172.16.0.0/12', // Private networks
      '192.168.0.0/16' // Private networks
    ];

    // Verificação básica - em produção, usar serviços como MaxMind
    return suspiciousRanges.some(range => this.isIPInRange(ipAddress, range));
  }

  private isIPInRange(ip: string, range: string): boolean {
    // Implementação simplificada - usar biblioteca específica em produção
    return false;
  }

  // Sistema de watermarking para dados
  addDataWatermark(data: any, userId: string): any {
    const watermark = {
      _watermark: crypto.createHash('md5')
        .update(`${userId}:${this.systemFingerprint}:${Date.now()}`)
        .digest('hex').substring(0, 8),
      _timestamp: Date.now()
    };

    return { ...data, ...watermark };
  }

  // Validação de watermark
  validateDataWatermark(data: any, userId: string): boolean {
    if (!data._watermark || !data._timestamp) return false;

    const expectedWatermark = crypto.createHash('md5')
      .update(`${userId}:${this.systemFingerprint}:${data._timestamp}`)
      .digest('hex').substring(0, 8);

    return data._watermark === expectedWatermark;
  }

  // Log de incidentes de segurança
  private async logSecurityIncident(type: string, description: string, metadata?: any): Promise<void> {
    try {
      await prisma.securityIncident.create({
        data: {
          type,
          description,
          metadata: JSON.stringify(metadata || {}),
          severity: this.calculateIncidentSeverity(type),
          timestamp: new Date(),
          resolved: false
        }
      });

      // Notificar equipe de segurança
      logger.error(`SECURITY INCIDENT: ${type}`, { description, metadata });
    } catch (error) {
      logger.error('Failed to log security incident', { error, type, description });
    }
  }

  private calculateIncidentSeverity(type: string): string {
    const severityMap: { [key: string]: string } = {
      'SYSTEM_INTEGRITY_VIOLATION': 'CRITICAL',
      'SUSPICIOUS_BEHAVIOR': 'HIGH',
      'UNAUTHORIZED_ACCESS': 'HIGH',
      'DATA_BREACH': 'CRITICAL',
      'COMPLIANCE_VIOLATION': 'HIGH'
    };

    return severityMap[type] || 'MEDIUM';
  }

  // Armazenar fingerprint do sistema
  private async getStoredFingerprint(): Promise<string | null> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: 'system_fingerprint' }
      });
      return config?.value || null;
    } catch (error) {
      return null;
    }
  }

  async storeSystemFingerprint(): Promise<void> {
    try {
      await prisma.systemConfig.upsert({
        where: { key: 'system_fingerprint' },
        create: {
          key: 'system_fingerprint',
          value: this.systemFingerprint
        },
        update: {
          value: this.systemFingerprint
        }
      });
    } catch (error) {
      logger.error('Failed to store system fingerprint', { error });
    }
  }

  // Geração de licença única do sistema
  generateSystemLicense(): string {
    const licenseData = {
      fingerprint: this.systemFingerprint,
      issued: Date.now(),
      version: '1.0.0',
      features: ['AML', 'COMPLIANCE', 'ADVANCED_SECURITY']
    };

    const signature = crypto.createHmac('sha256', this.encryptionKey)
      .update(JSON.stringify(licenseData))
      .digest('hex');

    return Buffer.from(JSON.stringify({ ...licenseData, signature })).toString('base64');
  }

  // Validação de licença
  validateSystemLicense(license: string): boolean {
    try {
      const licenseData = JSON.parse(Buffer.from(license, 'base64').toString());
      const { signature, ...data } = licenseData;

      const expectedSignature = crypto.createHmac('sha256', this.encryptionKey)
        .update(JSON.stringify(data))
        .digest('hex');

      return signature === expectedSignature && data.fingerprint === this.systemFingerprint;
    } catch (error) {
      return false;
    }
  }
}

export const advancedSecurity = AdvancedSecurityService.getInstance();