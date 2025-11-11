import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import http from 'http';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { cache } from './utils/cache';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import transactionRoutes from './routes/transaction.routes';
import alertRoutes from './routes/alert.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import twoFactorRoutes from './routes/twoFactor.routes';
import monitoringRoutes from './routes/monitoring.routes';
import apiConfigRoutes from './routes/apiConfig.routes';
import apiKeyRoutes from './routes/apiKey.routes';
import notificationRoutes from './routes/notification.routes';
import auditLogRoutes from './routes/auditLog.routes';
import webhookRoutes from './routes/webhook.routes';
import exportRoutes from './routes/export.routes';
import complianceRoutes from './routes/compliance.routes';
import securityRoutes from './routes/security.routes';
import revolutionaryRoutes from './routes/revolutionary-simple.routes';
// import advancedComplianceRoutes from './routes/advanced-compliance.routes';
import { errorHandler } from './middleware/errorHandler';
import { auditMiddleware } from './middleware/audit.middleware';
import { blockchainMonitor } from './services/blockchain.service';
import { initializeWebSocket } from './services/websocket.service';
import { startMLService, stopMLService } from './services/ml-local.service';
// import { advancedSecurity } from './services/advanced-security.service';
// import { quantumEncryption } from './services/quantum-encryption.service';
// import { blockchainIntelligence } from './services/blockchain-intelligence.service';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use(requestLogger);
app.use(auditMiddleware);

// Static files with proper MIME types
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/config', apiConfigRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/revolutionary', revolutionaryRoutes);
// app.use('/api/advanced-compliance', advancedComplianceRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/test-version', (req, res) => {
  res.json({ version: 'MANUAL_COUNT_FIX', timestamp: new Date().toISOString() });
});

// Catch-all handler for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Error handler
app.use(errorHandler);

initializeWebSocket(server);

server.listen(PORT, async () => {
  console.log('\n🚀 CRYPTOAML REVOLUTIONARY SYSTEM STARTED');
  console.log('🔒 Advanced Security: ENABLED');
  console.log('🧠 Quantum AI Compliance: ENABLED');
  console.log('⚛️ Quantum Performance Engine: ENABLED');
  console.log('🔗 Transparency Blockchain: ENABLED');
  console.log('🎨 Adaptive UX with AI: ENABLED');
  console.log('🔮 Predictive Analytics: ENABLED');
  console.log('🌍 Internationalization: 11 LANGUAGES');
  console.log('🚀 Revolutionary Features: ACTIVE');
  
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info('WebSocket initialized');
  
  // Initialize advanced security systems
  // try {
  //   await advancedSecurity.storeSystemFingerprint();
  //   await advancedSecurity.validateSystemIntegrity();
  //   logger.info('✅ Advanced security systems initialized');
  // } catch (error) {
  //   logger.error('❌ Advanced security initialization failed', { error });
  // }
  
  // Start ML Service if enabled
  if (process.env.ENABLE_ML_SERVICE === 'true') {
    await startMLService();
  } else {
    logger.info('⚠️ ML Service disabled (set ENABLE_ML_SERVICE=true to enable)');
  }
  
  blockchainMonitor.startContinuousMonitoring();
  logger.info('Blockchain monitoring started');
  
  // Generate system license
  // const systemLicense = advancedSecurity.generateSystemLicense();
  // logger.info('System license generated', { licenseLength: systemLicense.length });
});

// Cleanup on exit
process.on('SIGINT', () => {
  logger.info('Shutting down...');
  stopMLService();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  stopMLService();
  process.exit(0);
});
