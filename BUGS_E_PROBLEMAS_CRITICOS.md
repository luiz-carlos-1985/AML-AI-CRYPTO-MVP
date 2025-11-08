# 🐛 BUGS E PROBLEMAS CRÍTICOS ENCONTRADOS

## ❌ PROBLEMAS CRÍTICOS (IMPEDEM FUNCIONAMENTO)

### 1. **blockchain.service.ts - Erro Fatal no Schema do Prisma**
**Linha:** 19-22, 106-113
**Problema:** O código tenta criar/atualizar campos que NÃO existem no schema do Prisma
```typescript
// ERRO: Campo 'blockNumber' não existe no schema Transaction
const transaction = await prisma.transaction.create({
  data: {
    blockNumber: txData.blockNumber, // ❌ CAMPO NÃO EXISTE
    // ...
  }
});
```
**Impacto:** Aplicação QUEBRA ao tentar salvar transações
**Solução:** Adicionar campo ao schema ou remover do código

---

### 2. **blockchain.service.ts - Tipo Incorreto no Enum**
**Linha:** 207-209
**Problema:** Tentando usar string 'SUSPICIOUS_TRANSACTION' que não existe no enum AlertType
```typescript
type: 'SUSPICIOUS_TRANSACTION', // ❌ NÃO EXISTE NO ENUM
```
**Enum correto:**
```typescript
enum AlertType {
  HIGH_RISK_TRANSACTION
  SUSPICIOUS_PATTERN
  MIXER_DETECTED
  BLACKLISTED_ADDRESS
  UNUSUAL_VOLUME
  RAPID_MOVEMENT
}
```
**Impacto:** Erro ao criar alertas
**Solução:** Usar 'HIGH_RISK_TRANSACTION' ou 'SUSPICIOUS_PATTERN'

---

### 3. **blockchain.service.ts - Tipo Incorreto no RiskLevel**
**Linha:** 182, 209
**Problema:** calculateRiskLevel retorna string, mas schema espera enum RiskLevel
```typescript
private calculateRiskLevel(score: number): string { // ❌ DEVERIA SER RiskLevel
  return 'CRITICAL'; // string ao invés de enum
}
```
**Impacto:** Erro de tipo ao salvar no banco
**Solução:** Retornar tipo correto do enum

---

### 4. **wallet.service.ts - Chave de Criptografia Incorreta**
**Linha:** 38, 47
**Problema:** Usando apenas 64 caracteres de uma chave hex de 64 bytes
```typescript
Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex') // ❌ ERRADO
// Deveria ser:
Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32) // ✅ CORRETO
```
**Impacto:** Criptografia pode falhar ou ser insegura
**Solução:** Corrigir o slice

---

### 5. **websocket.service.ts - CORS Hardcoded**
**Linha:** 8
**Problema:** CORS configurado apenas para localhost
```typescript
origin: 'http://localhost:3000', // ❌ NÃO FUNCIONA EM PRODUÇÃO
```
**Impacto:** WebSocket não funciona em produção
**Solução:** Usar variável de ambiente

---

## ⚠️ PROBLEMAS GRAVES (CAUSAM BUGS)

### 6. **blockchain.service.ts - Sem Tratamento de Erro**
**Linha:** 33-35
**Problema:** Erro capturado mas não retornado
```typescript
catch (error) {
  console.error('❌ Wallet monitoring failed:', error);
  // ❌ NÃO RETORNA NADA - função retorna undefined
}
```
**Impacto:** Chamador não sabe se houve erro
**Solução:** Lançar erro ou retornar null

---

### 7. **blockchain.service.ts - Race Condition**
**Linha:** 95-97
**Problema:** Verificação de transação existente não é atômica
```typescript
const existingTx = await prisma.transaction.findUnique({ where: { hash: txData.hash } });
if (existingTx) return;
const transaction = await prisma.transaction.create({ ... }); // ❌ PODE DUPLICAR
```
**Impacto:** Transações duplicadas no banco
**Solução:** Usar upsert ou unique constraint com try/catch

---

### 8. **blockchain.service.ts - Lógica de Risco Incorreta**
**Linha:** 147-151
**Problema:** Conta transações do fromAddress, mas deveria contar do walletId
```typescript
const recentTxCount = await prisma.transaction.count({
  where: {
    fromAddress: transaction.fromAddress, // ❌ ERRADO
    // Deveria ser: walletId: transaction.walletId
  }
});
```
**Impacto:** Análise de risco incorreta
**Solução:** Filtrar por walletId

---

### 9. **blockchain.service.ts - Memory Leak**
**Linha:** 223-234
**Problema:** setInterval sem clearInterval
```typescript
async startContinuousMonitoring() {
  setInterval(async () => { // ❌ NUNCA É LIMPO
    // ...
  }, 30000);
}
```
**Impacto:** Memory leak em produção
**Solução:** Armazenar referência e permitir parar

---

### 10. **blockchain.service.ts - Erro Silencioso**
**Linha:** 61-64, 89-92
**Problema:** Erros retornam array vazio sem log
```typescript
catch (error) {
  return []; // ❌ ERRO SILENCIOSO
}
```
**Impacto:** Impossível debugar problemas
**Solução:** Logar erro antes de retornar

---

### 11. **wallet.service.ts - Geração de Chave Insegura**
**Linha:** 4
**Problema:** Gera chave aleatória se não existir
```typescript
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
// ❌ CHAVE MUDA A CADA RESTART
```
**Impacto:** Dados criptografados ficam inacessíveis após restart
**Solução:** Lançar erro se chave não existir

---

### 12. **wallet.service.ts - Sem Validação de Entrada**
**Linha:** 17, 27
**Problema:** Não valida mnemonic ou privateKey antes de usar
```typescript
static importFromMnemonic(mnemonic: string, index: number = 0) {
  // ❌ NÃO VALIDA SE MNEMONIC É VÁLIDO
  const wallet = ethers.Wallet.fromPhrase(mnemonic, ...);
}
```
**Impacto:** Erro não tratado se entrada inválida
**Solução:** Validar com try/catch e mensagem clara

---

### 13. **report.service.ts - Divisão por Zero**
**Linha:** 28
**Problema:** Pode dividir por zero
```typescript
const avgRiskScore = transactions.length > 0 
  ? transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length 
  : 0;
// ✅ CORRETO - mas linha 73 tem problema:
const percentage = (count / totalTx) * 100; // ❌ totalTx pode ser 0
```
**Impacto:** NaN nos relatórios
**Solução:** Verificar totalTx > 0

---

### 14. **report.service.ts - Tipo Incorreto**
**Linha:** 28
**Problema:** amount é Decimal no Prisma, não number
```typescript
const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
// ❌ t.amount já é Decimal, não string
```
**Impacto:** Erro de tipo
**Solução:** Converter corretamente

---

### 15. **wallet.routes.ts - Exposição de Chave Privada**
**Linha:** 24-27
**Problema:** Retorna chave privada e mnemonic na resposta
```typescript
res.json({
  wallet,
  mnemonic: walletData.mnemonic, // ❌ NUNCA RETORNAR ISSO
  privateKey: walletData.privateKey // ❌ EXTREMAMENTE PERIGOSO
});
```
**Impacto:** VULNERABILIDADE DE SEGURANÇA CRÍTICA
**Solução:** Retornar apenas uma vez e avisar usuário para guardar

---

### 16. **wallet.routes.ts - Sem Validação de Endereço**
**Linha:** 100-102
**Problema:** Não valida se endereço é válido
```typescript
const { address, blockchain, label } = req.body;
if (!address || !blockchain) { // ❌ NÃO VALIDA FORMATO
  return res.status(400).json({ error: 'Address and blockchain required' });
}
```
**Impacto:** Endereços inválidos salvos no banco
**Solução:** Validar formato do endereço

---

### 17. **wallet.routes.ts - Erro de Lógica**
**Linha:** 131-145
**Problema:** Simula sync ao invés de fazer sync real
```typescript
const newTransactions = Math.floor(Math.random() * 5); // ❌ FAKE
```
**Impacto:** Funcionalidade não funciona
**Solução:** Implementar sync real ou remover

---

### 18. **planLimits.ts - Nova Instância do Prisma**
**Linha:** 5
**Problema:** Cria nova instância ao invés de usar singleton
```typescript
const prisma = new PrismaClient(); // ❌ DEVERIA IMPORTAR
```
**Impacto:** Múltiplas conexões com banco
**Solução:** Importar de utils/prisma

---

### 19. **server.ts - Rate Limit Aplicado Depois das Rotas**
**Linha:** 75-80
**Problema:** Rate limit definido DEPOIS das rotas
```typescript
app.use('/api/auth', authRoutes);
// ... outras rotas
app.use('/api/', limiter); // ❌ MUITO TARDE
```
**Impacto:** Rate limit não funciona
**Solução:** Mover antes das rotas

---

### 20. **Falta Validação de Input em TODOS os Controllers**
**Problema:** Nenhum controller valida entrada com Joi
```typescript
export const createWallet = async (req: AuthRequest, res: Response) => {
  const { address, blockchain, label } = req.body; // ❌ SEM VALIDAÇÃO
}
```
**Impacto:** SQL injection, XSS, dados inválidos
**Solução:** Adicionar validação Joi em todas as rotas

---

## 🔧 PROBLEMAS DE IMPLEMENTAÇÃO

### 21. **Falta Paginação**
**Problema:** Queries sem limit podem retornar milhões de registros
```typescript
const transactions = await prisma.transaction.findMany({ where }); // ❌ SEM LIMIT
```
**Solução:** Adicionar paginação em todas as listagens

---

### 22. **Falta Índices no Banco**
**Problema:** Queries lentas sem índices
**Solução:** Adicionar índices em:
- Transaction.walletId
- Transaction.timestamp
- Transaction.riskLevel
- Alert.userId
- Alert.createdAt

---

### 23. **Logs com Console.log**
**Problema:** Usando console.log ao invés do logger criado
**Solução:** Substituir todos console.log por logger

---

### 24. **Falta Testes**
**Problema:** Apenas 1 teste de autenticação
**Solução:** Adicionar testes para todas as funcionalidades

---

### 25. **Falta Documentação de API**
**Problema:** Sem Swagger/OpenAPI
**Solução:** Adicionar documentação interativa

---

## 📊 RESUMO

| Categoria | Quantidade |
|-----------|------------|
| 🔴 Críticos (Quebram Sistema) | 5 |
| 🟠 Graves (Causam Bugs) | 15 |
| 🟡 Implementação Ruim | 5 |
| **TOTAL** | **25 PROBLEMAS** |

## 🎯 PRIORIDADE DE CORREÇÃO

### URGENTE (Corrigir AGORA):
1. ✅ Problema #1 - Schema Prisma
2. ✅ Problema #2 - Enum AlertType
3. ✅ Problema #3 - Tipo RiskLevel
4. ✅ Problema #15 - Exposição de chaves privadas
5. ✅ Problema #5 - CORS WebSocket

### ALTA (Corrigir antes de produção):
6. ✅ Problema #4 - Criptografia
7. ✅ Problema #7 - Race condition
8. ✅ Problema #9 - Memory leak
9. ✅ Problema #11 - Chave aleatória
10. ✅ Problema #18 - Prisma duplicado
11. ✅ Problema #19 - Rate limit
12. ✅ Problema #20 - Validação de input

### MÉDIA (Melhorias importantes):
13. ✅ Problema #6, #10 - Tratamento de erros
14. ✅ Problema #8 - Lógica de risco
15. ✅ Problema #12 - Validação de entrada
16. ✅ Problema #16 - Validação de endereço
17. ✅ Problema #21 - Paginação
18. ✅ Problema #23 - Logger

### BAIXA (Pode esperar):
19. ✅ Problema #13, #14 - Tipos
20. ✅ Problema #17 - Sync fake
21. ✅ Problema #22 - Índices
22. ✅ Problema #24 - Testes
23. ✅ Problema #25 - Documentação
