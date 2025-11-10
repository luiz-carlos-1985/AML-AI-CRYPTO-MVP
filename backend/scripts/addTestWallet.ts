import prisma from '../src/utils/prisma';
import { blockchainMonitor } from '../src/services/blockchain.service';
import { Blockchain } from '@prisma/client';

async function addTestWallet() {
  try {
    console.log('🔍 Buscando usuário...');
    
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    });
    
    if (!user) {
      console.error('❌ Nenhum usuário encontrado. Crie uma conta primeiro.');
      process.exit(1);
    }
    
    console.log(`✅ Usuário encontrado: ${user.email}`);
    
    const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    
    console.log('\n📝 Criando carteira de teste...');
    
    const existingWallet = await prisma.wallet.findUnique({
      where: { address: testAddress }
    });
    
    if (existingWallet) {
      console.log('⚠️  Carteira já existe. Sincronizando...');
      await blockchainMonitor.monitorWallet(testAddress, Blockchain.ETHEREUM, user.id);
      console.log('✅ Sincronização concluída!');
      
      const wallet = await prisma.wallet.findUnique({
        where: { address: testAddress },
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      });
      
      console.log(`\n📊 Transações encontradas: ${wallet?._count.transactions || 0}`);
      process.exit(0);
    }
    
    const wallet = await prisma.wallet.create({
      data: {
        address: testAddress,
        blockchain: Blockchain.ETHEREUM,
        label: 'Vitalik Buterin (Teste)',
        userId: user.id
      }
    });
    
    console.log('✅ Carteira criada!');
    console.log('\n🔄 Sincronizando transações...');
    
    await blockchainMonitor.monitorWallet(wallet.address, wallet.blockchain, wallet.userId);
    
    const updatedWallet = await prisma.wallet.findUnique({
      where: { id: wallet.id },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
    
    console.log('\n✅ SUCESSO!');
    console.log('═'.repeat(60));
    console.log(`📍 Endereço: ${testAddress}`);
    console.log(`🔗 Blockchain: ETHEREUM`);
    console.log(`📊 Transações: ${updatedWallet?._count.transactions || 0}`);
    console.log('═'.repeat(60));
    console.log('\n🌐 Acesse o sistema e veja as transações!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTestWallet();
