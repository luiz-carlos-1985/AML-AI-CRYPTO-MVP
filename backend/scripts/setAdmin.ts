import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin() {
  const email = 'luizcarlos_1985@hotmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { 
        role: 'ADMIN',
        plan: 'ENTERPRISE'
      }
    });
    
    console.log(`✅ User ${user.email} is now an ADMIN with ENTERPRISE plan`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
