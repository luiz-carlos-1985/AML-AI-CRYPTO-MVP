import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function validateProduction() {
  console.log('🔍 Validating Production Configuration...\n');

  let errors = 0;
  let warnings = 0;

  // Check JWT Secret
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    console.error('❌ JWT_SECRET is not set or using default value');
    errors++;
  } else if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters');
    warnings++;
  } else {
    console.log('✅ JWT_SECRET is properly configured');
  }

  // Check Database Connection
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if migrations are applied
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ Database schema is valid');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    errors++;
  }

  // Check Environment
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  NODE_ENV is not set to production');
    warnings++;
  } else {
    console.log('✅ NODE_ENV is set to production');
  }

  // Check Redis Configuration
  if (!process.env.REDIS_HOST) {
    console.warn('⚠️  REDIS_HOST is not configured');
    warnings++;
  } else {
    console.log('✅ Redis configuration found');
  }

  // Check ML Service
  if (!process.env.ML_SERVICE_URL) {
    console.warn('⚠️  ML_SERVICE_URL is not configured');
    warnings++;
  } else {
    console.log('✅ ML Service URL configured');
  }

  // Check Rate Limiting
  if (!process.env.RATE_LIMIT_WINDOW_MS || !process.env.RATE_LIMIT_MAX_REQUESTS) {
    console.warn('⚠️  Rate limiting not fully configured');
    warnings++;
  } else {
    console.log('✅ Rate limiting configured');
  }

  await prisma.$disconnect();

  console.log('\n📊 Validation Summary:');
  console.log(`   Errors: ${errors}`);
  console.log(`   Warnings: ${warnings}`);

  if (errors > 0) {
    console.log('\n❌ Production validation FAILED. Please fix errors before deploying.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Production validation passed with warnings. Review before deploying.');
    process.exit(0);
  } else {
    console.log('\n✅ Production validation PASSED. System is ready for deployment.');
    process.exit(0);
  }
}

validateProduction();
