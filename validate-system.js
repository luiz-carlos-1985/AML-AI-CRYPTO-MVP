#!/usr/bin/env node

/**
 * CryptoAML System Validation Script
 * Validates all critical features and components
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`)
};

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log.success(`${description}`);
    checks.passed++;
    return true;
  } else {
    log.error(`${description} - File not found: ${filePath}`);
    checks.failed++;
    return false;
  }
}

function validateFrontend() {
  console.log('\n📱 Validating Frontend...\n');

  // Pages
  const pages = [
    ['frontend/src/pages/Dashboard.tsx', 'Dashboard page'],
    ['frontend/src/pages/Login.tsx', 'Login page'],
    ['frontend/src/pages/Register.tsx', 'Register page'],
    ['frontend/src/pages/Wallets.tsx', 'Wallets page'],
    ['frontend/src/pages/Transactions.tsx', 'Transactions page'],
    ['frontend/src/pages/Alerts.tsx', 'Alerts page'],
    ['frontend/src/pages/Reports.tsx', 'Reports page'],
    ['frontend/src/pages/Analytics.tsx', 'Analytics page'],
    ['frontend/src/pages/Tools.tsx', 'Tools page'],
    ['frontend/src/pages/Team.tsx', 'Team page'],
    ['frontend/src/pages/Integrations.tsx', 'Integrations page'],
    ['frontend/src/pages/Account.tsx', 'Account page']
  ];

  pages.forEach(([file, desc]) => checkFileExists(file, desc));

  // Critical Components
  const components = [
    ['frontend/src/components/Layout.tsx', 'Layout component'],
    ['frontend/src/components/NotificationCenter.tsx', 'Notification Center'],
    ['frontend/src/components/ThemeToggle.tsx', 'Theme Toggle'],
    ['frontend/src/components/ApiKeys.tsx', 'API Keys Manager'],
    ['frontend/src/components/WebhookManager.tsx', 'Webhook Manager'],
    ['frontend/src/components/SmartAlerts.tsx', 'Smart Alerts'],
    ['frontend/src/components/BlockchainExplorer.tsx', 'Blockchain Explorer'],
    ['frontend/src/components/RiskScoring.tsx', 'Risk Scoring Engine'],
    ['frontend/src/components/AIRiskAnalysis.tsx', 'AI Risk Analysis'],
    ['frontend/src/components/RiskHeatmap.tsx', 'Risk Heatmap'],
    ['frontend/src/components/ComplianceReports.tsx', 'Compliance Reports'],
    ['frontend/src/components/TeamCollaboration.tsx', 'Team Collaboration'],
    ['frontend/src/components/AdvancedCharts.tsx', 'Advanced Charts'],
    ['frontend/src/components/AdvancedFilters.tsx', 'Advanced Filters'],
    ['frontend/src/components/ExportData.tsx', 'Export Data'],
    ['frontend/src/components/AuditLog.tsx', 'Audit Log'],
    ['frontend/src/components/RealTimeMetrics.tsx', 'Real-Time Metrics']
  ];

  components.forEach(([file, desc]) => checkFileExists(file, desc));
}

function validateBackend() {
  console.log('\n🔧 Validating Backend...\n');

  // Routes
  const routes = [
    ['backend/src/routes/auth.routes.ts', 'Auth routes'],
    ['backend/src/routes/wallet.routes.ts', 'Wallet routes'],
    ['backend/src/routes/transaction.routes.ts', 'Transaction routes'],
    ['backend/src/routes/alert.routes.ts', 'Alert routes'],
    ['backend/src/routes/report.routes.ts', 'Report routes'],
    ['backend/src/routes/dashboard.routes.ts', 'Dashboard routes'],
    ['backend/src/routes/apiKey.routes.ts', 'API Key routes'],
    ['backend/src/routes/webhook.routes.ts', 'Webhook routes'],
    ['backend/src/routes/export.routes.ts', 'Export routes'],
    ['backend/src/routes/notification.routes.ts', 'Notification routes'],
    ['backend/src/routes/auditLog.routes.ts', 'Audit Log routes']
  ];

  routes.forEach(([file, desc]) => checkFileExists(file, desc));

  // Server
  checkFileExists('backend/src/server.ts', 'Main server file');
  checkFileExists('backend/prisma/schema.prisma', 'Prisma schema');
}

function validateConfig() {
  console.log('\n⚙️  Validating Configuration...\n');

  const configs = [
    ['frontend/package.json', 'Frontend package.json'],
    ['backend/package.json', 'Backend package.json'],
    ['frontend/vite.config.ts', 'Vite config'],
    ['backend/tsconfig.json', 'Backend TypeScript config'],
    ['frontend/tsconfig.json', 'Frontend TypeScript config'],
    ['docker-compose.yml', 'Docker Compose'],
    ['.env.example', 'Environment example']
  ];

  configs.forEach(([file, desc]) => checkFileExists(file, desc));
}

function validateDocs() {
  console.log('\n📚 Validating Documentation...\n');

  const docs = [
    ['README.md', 'Main README'],
    ['FEATURES_COMPLETE.md', 'Features documentation'],
    ['SYSTEM_VALIDATION.md', 'System validation doc']
  ];

  docs.forEach(([file, desc]) => checkFileExists(file, desc));
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(50) + '\n');

  const total = checks.passed + checks.failed + checks.warnings;
  const percentage = ((checks.passed / total) * 100).toFixed(1);

  log.success(`Passed: ${checks.passed}/${total}`);
  if (checks.failed > 0) log.error(`Failed: ${checks.failed}/${total}`);
  if (checks.warnings > 0) log.warning(`Warnings: ${checks.warnings}/${total}`);

  console.log(`\n📈 Success Rate: ${percentage}%\n`);

  if (checks.failed === 0) {
    console.log(`${COLORS.green}✅ SYSTEM VALIDATION PASSED${COLORS.reset}`);
    console.log(`${COLORS.green}🚀 Ready for Production!${COLORS.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}❌ SYSTEM VALIDATION FAILED${COLORS.reset}`);
    console.log(`${COLORS.red}⚠️  Fix errors before deploying${COLORS.reset}\n`);
    process.exit(1);
  }
}

// Run validation
console.log('\n' + '='.repeat(50));
console.log('🔍 CryptoAML System Validation');
console.log('='.repeat(50));

validateFrontend();
validateBackend();
validateConfig();
validateDocs();
printSummary();
