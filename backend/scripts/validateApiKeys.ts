import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ValidationResult {
  service: string;
  status: 'valid' | 'invalid' | 'missing';
  message: string;
}

async function validateEtherscanKey(): Promise<ValidationResult> {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  
  if (!apiKey || apiKey === 'YourApiKeyToken') {
    return {
      service: 'Etherscan',
      status: 'missing',
      message: '❌ API key não configurada. Obtenha em: https://etherscan.io/myapikey'
    };
  }

  if (apiKey.length < 20) {
    return {
      service: 'Etherscan',
      status: 'invalid',
      message: `❌ API key incompleta (${apiKey.length} caracteres, esperado 34+)`
    };
  }

  try {
    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        chainid: 1,
        module: 'account',
        action: 'balance',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        apikey: apiKey
      },
      timeout: 10000
    });

    if (response.data.status === '1') {
      return {
        service: 'Etherscan',
        status: 'valid',
        message: '✅ API key válida e funcionando'
      };
    } else {
      return {
        service: 'Etherscan',
        status: 'invalid',
        message: `❌ API key inválida: ${response.data.message || 'Erro desconhecido'}`
      };
    }
  } catch (error: any) {
    return {
      service: 'Etherscan',
      status: 'invalid',
      message: `❌ Erro ao validar: ${error.message}`
    };
  }
}

async function validateAlchemyKey(): Promise<ValidationResult> {
  const apiKey = process.env.ALCHEMY_API_KEY;
  
  if (!apiKey) {
    return {
      service: 'Alchemy',
      status: 'missing',
      message: '❌ API key não configurada. Obtenha em: https://www.alchemy.com/'
    };
  }

  if (apiKey.length < 20) {
    return {
      service: 'Alchemy',
      status: 'invalid',
      message: `❌ API key incompleta (${apiKey.length} caracteres, esperado 32+)`
    };
  }

  try {
    const response = await axios.post(
      `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: []
      },
      { timeout: 10000 }
    );

    if (response.data.result) {
      return {
        service: 'Alchemy',
        status: 'valid',
        message: '✅ API key válida e funcionando'
      };
    } else {
      return {
        service: 'Alchemy',
        status: 'invalid',
        message: `❌ API key inválida: ${response.data.error?.message || 'Erro desconhecido'}`
      };
    }
  } catch (error: any) {
    return {
      service: 'Alchemy',
      status: 'invalid',
      message: `❌ Erro ao validar: ${error.message}`
    };
  }
}

async function main() {
  console.log('\n🔍 Validando API Keys...\n');
  console.log('═'.repeat(60));
  
  const results: ValidationResult[] = [];
  
  // Validate Etherscan
  console.log('\n📡 Testando Etherscan API...');
  const etherscanResult = await validateEtherscanKey();
  results.push(etherscanResult);
  console.log(`   ${etherscanResult.message}`);
  
  console.log('\n' + '═'.repeat(60));
  
  const allValid = results.every(r => r.status === 'valid');
  const hasInvalid = results.some(r => r.status === 'invalid' || r.status === 'missing');
  
  if (allValid) {
    console.log('\n✅ TODAS AS API KEYS ESTÃO VÁLIDAS!');
    console.log('   O sistema de monitoramento blockchain está pronto.\n');
    process.exit(0);
  } else if (hasInvalid) {
    console.log('\n❌ ETHERSCAN API KEY INVÁLIDA!');
    console.log('\n⚠️  O sistema precisa de uma chave Etherscan válida.');
    console.log('\n📚 Obtenha em: https://etherscan.io/myapikey\n');
    process.exit(1);
  }
}

main().catch(console.error);
