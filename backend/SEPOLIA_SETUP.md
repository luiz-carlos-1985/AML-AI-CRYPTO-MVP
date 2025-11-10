# 🔧 Sepolia Testnet - Configuração

## ⚠️ Problema
Etherscan API para Sepolia está **DEPRECIADA** e não funciona mais.

## ✅ Solução Implementada

### Opção 1: Alchemy (RECOMENDADO)
Alchemy fornece API gratuita para Sepolia com histórico completo de transações.

#### Setup:
1. Crie conta gratuita: https://www.alchemy.com/
2. Crie app Sepolia
3. Copie API key
4. Adicione no `.env`:
```bash
ALCHEMY_API_KEY=sua_chave_alchemy_aqui
```

#### Benefícios:
- ✅ Histórico completo de transações
- ✅ 300M compute units/mês grátis
- ✅ API confiável e rápida
- ✅ Suporte a múltiplas testnets

### Opção 2: RPC Público (Fallback)
Sem Alchemy, usa RPC público que só fornece balance.

#### Limitações:
- ✅ Balance atual
- ✅ Transaction count
- ❌ Sem histórico de transações

## 🚀 Como Funciona

### Com Alchemy API Key:
```typescript
// Busca últimas 50 transações via Alchemy
POST https://eth-sepolia.g.alchemy.com/v2/{apiKey}
{
  "method": "alchemy_getAssetTransfers",
  "params": [{
    "fromAddress": "0x...",
    "category": ["external", "internal"],
    "maxCount": "0x32"
  }]
}
```

### Sem Alchemy (Fallback):
```typescript
// Apenas balance via RPC público
POST https://rpc.sepolia.org
{
  "method": "eth_getBalance",
  "params": ["0x...", "latest"]
}
```

## 📊 Comparação

| Feature | Etherscan | Alchemy | RPC Público |
|---------|-----------|---------|-------------|
| Histórico TX | ❌ Depreciado | ✅ Completo | ❌ Não disponível |
| Balance | ❌ | ✅ | ✅ |
| TX Count | ❌ | ✅ | ✅ |
| Rate Limit | N/A | 300M/mês | Ilimitado |
| Custo | N/A | Grátis | Grátis |

## 🎯 Recomendação

Para produção com Sepolia, **USE ALCHEMY**:
```bash
# .env
ALCHEMY_API_KEY=sua_chave_aqui
```

Sem Alchemy, Sepolia funcionará apenas para mostrar balance, sem histórico.
