import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();

async function healthCheck() {
  console.log('🏥 Running Health Check...\n');

  const results = {
    database: false,
    redis: false,
    mlService: false,
    api: false
  };

  // Check Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database: Healthy');
    results.database = true;
  } catch (error) {
    console.error('❌ Database: Unhealthy', error);
  }

  // Check Redis
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
    await redis.ping();
    console.log('✅ Redis: Healthy');
    results.redis = true;
    redis.disconnect();
  } catch (error) {
    console.error('❌ Redis: Unhealthy', error);
  }

  // Check ML Service
  try {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    await axios.get(`${mlUrl}/health`, { timeout: 5000 });
    console.log('✅ ML Service: Healthy');
    results.mlService = true;
  } catch (error) {
    console.error('❌ ML Service: Unhealthy');
  }

  // Check API
  try {
    const apiUrl = `http://localhost:${process.env.PORT || 3001}`;
    await axios.get(`${apiUrl}/health`, { timeout: 5000 });
    console.log('✅ API: Healthy');
    results.api = true;
  } catch (error) {
    console.error('❌ API: Unhealthy');
  }

  await prisma.$disconnect();

  const allHealthy = Object.values(results).every(v => v);
  
  console.log('\n📊 Health Check Summary:');
  console.log(`   Overall Status: ${allHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
  
  process.exit(allHealthy ? 0 : 1);
}

healthCheck();
