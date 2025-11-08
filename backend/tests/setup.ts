import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/cryptoaml_test';
  process.env.JWT_SECRET = 'test-secret-key';
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data
  const tables = ['Alert', 'Report', 'Transaction', 'Wallet', 'ApiKey', 'PaymentSettings', 'ApiConfiguration', 'User'];
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
});
