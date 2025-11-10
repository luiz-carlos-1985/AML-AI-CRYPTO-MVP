# 🔑 Configuração de API Keys

## ⚠️ Problema Identificado

A **função principal do sistema** (monitoramento de transações blockchain) não funciona porque as **chaves de API estão incompletas ou inválidas**.

## 📋 APIs Necessárias

### 1. Etherscan API (Obrigatória)
- **Uso:** Buscar transações de Ethereum, Polygon, Arbitrum, Optimism, BSC, Base
- **Chave atual:** `649EM4JUJIVV2J8F1IM13QZP1FIG1HZ4H2` ❌ (incompleta - faltam caracteres)
- **Como obter:**
  1. Acesse: https://etherscan.io/register
  2. Crie uma conta gratuita
  3. Vá em: https://etherscan.io/myapikey
  4. Crie uma nova API key
  5. Copie a chave completa (34 caracteres)

### 2. Alchemy API (Obrigatória para Sepolia)
- **Uso:** Buscar transações da rede Sepolia (testnet)
- **Chave atual:** `LO4rb75qOoa_9s7ZW8KBL` ❌ (incompleta - faltam ~15 caracteres)
- **Como obter:**
  1. Acesse: https://www.alchemy.com/
  2. Crie uma conta gratuita
  3. Crie um novo App para "Ethereum Sepolia"
  4. Copie a API Key completa (32+ caracteres)

## 🔧 Como Configurar

### Passo 1: Obter as chaves
Siga os links acima e obtenha suas chaves de API gratuitas.

### Passo 2: Atualizar o arquivo .env
Edite o arquivo `backend/.env`:

```env
# Substitua com suas chaves COMPLETAS
ETHERSCAN_API_KEY=SUA_CHAVE_ETHERSCAN_COMPLETA_AQUI
ALCHEMY_API_KEY=SUA_CHAVE_ALCHEMY_COMPLETA_AQUI
```

### Passo 3: Reiniciar o backend
```bash
cd backend
npm run dev
```

## ✅ Verificação

Após configurar as chaves, teste adicionando uma carteira:

1. Acesse o sistema
2. Vá em "Wallets"
3. Adicione uma carteira de teste Sepolia:
   - Endereço: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Blockchain: Sepolia
4. Clique em "Sync" (ícone de refresh)
5. Aguarde alguns segundos
6. Verifique se as transações aparecem

## 🆓 Limites Gratuitos

### Etherscan Free Tier
- ✅ 5 requisições/segundo
- ✅ 100.000 requisições/dia
- ✅ Suficiente para MVP

### Alchemy Free Tier
- ✅ 300M compute units/mês
- ✅ ~3M requisições/mês
- ✅ Suficiente para MVP

## 🚨 Sem as chaves corretas:
- ❌ Sincronização de carteiras não funciona
- ❌ Transações não são detectadas
- ❌ Alertas não são gerados
- ❌ Sistema AML não opera

## 📝 Notas Importantes

1. **Nunca compartilhe suas chaves de API** em repositórios públicos
2. As chaves gratuitas são suficientes para desenvolvimento e MVP
3. Para produção, considere planos pagos com limites maiores
4. Bitcoin funciona sem API key (usa Blockstream API pública)

## 🔗 Links Úteis

- Etherscan API Docs: https://docs.etherscan.io/
- Alchemy Docs: https://docs.alchemy.com/
- Blockstream API: https://github.com/Blockstream/esplora/blob/master/API.md
