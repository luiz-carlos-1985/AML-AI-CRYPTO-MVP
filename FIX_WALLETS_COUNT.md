# 🔧 FIX: Wallets _count undefined

## 🔍 Problema Identificado

O frontend está recebendo `_count: undefined` porque o **backend precisa ser reiniciado**.

### Log do Frontend:
```javascript
Wallet 1: {
  label: 'Carteira2',
  address: '0xdF2514cDFb612849405e5E8CF7f22217f8191fF1',
  _count: undefined,  // ❌ PROBLEMA
  transactionCount: undefined,
  alertCount: undefined
}
```

### Código do Backend (JÁ CORRETO):
```typescript
// backend/src/controllers/wallet.controller.ts (linhas 60-80)
const walletsWithCounts = await Promise.all(
  wallets.map(async (wallet) => {
    const transactionCount = await prisma.transaction.count({
      where: { walletId: wallet.id }
    });
    const alertCount = await prisma.alert.count({
      where: { walletId: wallet.id }
    });
    
    return {
      ...wallet,
      _count: {
        transactions: transactionCount,
        alerts: alertCount
      }
    };
  })
);
```

✅ O código está correto, mas o backend está rodando a versão antiga!

---

## 🚀 Solução: Reiniciar o Backend

### Opção 1: Script Automático
```powershell
.\RESTART_BACKEND.ps1
```

### Opção 2: Manual
```powershell
# Parar Node.js
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Ir para backend
cd backend

# Reiniciar
npm run dev
```

### Opção 3: Comando Único
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; cd backend; npm run dev
```

---

## ✅ Verificar se Funcionou

### 1. Verificar Logs do Backend
Após reiniciar, você deve ver no terminal do backend:
```
Found 2 wallets, calculating counts...
Wallet Carteira2: 5 transactions, 2 alerts
Sending wallets with counts: [{"label":"Carteira2","_count":{"transactions":5,"alerts":2}}]
```

### 2. Verificar Console do Frontend
No console do navegador (F12), você deve ver:
```javascript
Wallet 1: {
  label: 'Carteira2',
  address: '0xdF2514cDFb612849405e5E8CF7f22217f8191fF1',
  _count: {
    transactions: 5,  // ✅ CORRETO
    alerts: 2         // ✅ CORRETO
  }
}
```

### 3. Verificar Interface
Na página de Wallets, você deve ver:
- 🔵 Transactions: 5
- 🟠 Alerts: 2
- ✅ Risk: LOW

---

## 🔄 Fluxo Completo

1. **Backend recebe requisição** → `/api/wallets`
2. **Busca wallets do usuário** → `prisma.wallet.findMany()`
3. **Para cada wallet:**
   - Conta transações → `prisma.transaction.count()`
   - Conta alerts → `prisma.alert.count()`
4. **Retorna com _count:**
   ```json
   {
     "id": "...",
     "address": "0x...",
     "label": "Carteira2",
     "_count": {
       "transactions": 5,
       "alerts": 2
     }
   }
   ```
5. **Frontend exibe os dados**

---

## 🐛 Se Ainda Não Funcionar

### Verificar se há transações no banco:
```sql
-- Conectar no PostgreSQL
psql -U admin -d cryptoaml

-- Verificar wallets
SELECT id, label, address FROM "Wallet";

-- Verificar transações
SELECT "walletId", COUNT(*) FROM "Transaction" GROUP BY "walletId";

-- Verificar alerts
SELECT "walletId", COUNT(*) FROM "Alert" GROUP BY "walletId";
```

### Adicionar mais logs no backend:
O código já tem logs, mas você pode adicionar mais:
```typescript
console.log('Raw wallet data:', JSON.stringify(wallet, null, 2));
console.log('Transaction count:', transactionCount);
console.log('Alert count:', alertCount);
```

---

## 📊 Estrutura Esperada

### Request:
```
GET /api/wallets
Authorization: Bearer <token>
```

### Response:
```json
[
  {
    "id": "uuid",
    "address": "0xdF2514cDFb612849405e5E8CF7f22217f8191fF1",
    "blockchain": "ETHEREUM",
    "label": "Carteira2",
    "riskLevel": "LOW",
    "riskScore": 0,
    "isMonitored": true,
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "transactions": 5,
      "alerts": 2
    }
  }
]
```

---

## ✅ Checklist

- [ ] Backend reiniciado
- [ ] Logs do backend mostram "calculating counts..."
- [ ] Logs do backend mostram "_count" com valores
- [ ] Console do frontend mostra "_count" com valores
- [ ] Interface mostra contadores corretos
- [ ] Botão "Sync" funciona e atualiza contadores

---

*Solução: Reiniciar o backend para aplicar as mudanças no controller*
