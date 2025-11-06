# 💰 Guia de Testes com Carteiras Reais

## 🎯 Objetivo
Testar o CryptoAML com sua própria carteira e transações reais de forma **segura e econômica**.

---

## ⚠️ IMPORTANTE - Segurança Primeiro

### 🔒 Regras de Ouro
1. ✅ **NUNCA** compartilhe sua chave privada
2. ✅ Use carteiras de **teste** primeiro
3. ✅ Comece com **valores pequenos** (< $10)
4. ✅ Use **testnets** antes de mainnet
5. ✅ Faça **backup** de tudo

---

## 🆓 Opção 1: Testnets (100% GRATUITO)

### ✅ Vantagens
- ✅ Totalmente gratuito
- ✅ Sem risco financeiro
- ✅ Transações reais (testnet)
- ✅ Testa todas as funcionalidades

### 📋 Passo a Passo

#### 1. Criar Carteira de Teste (5 min)

**Ethereum Testnet (Sepolia):**
```bash
# Instalar MetaMask (gratuito)
# https://metamask.io

# Adicionar Rede Sepolia
Network Name: Sepolia
RPC URL: https://rpc.sepolia.org
Chain ID: 11155111
Currency: SepoliaETH
```

**Obter ETH de Teste (gratuito):**
```
Faucets gratuitos:
1. https://sepoliafaucet.com
2. https://www.alchemy.com/faucets/ethereum-sepolia
3. https://faucet.quicknode.com/ethereum/sepolia

Receba: 0.5 SepoliaETH (gratuito)
```

#### 2. Adicionar no CryptoAML (2 min)

```bash
# Iniciar sistema
docker-compose up -d

# Acessar
http://localhost:3000

# Login > Wallets > Add Wallet
Blockchain: Ethereum (Sepolia)
Address: sua-carteira-testnet
Label: Minha Carteira Teste
```

#### 3. Fazer Transações de Teste (5 min)

```bash
# No MetaMask, enviar para outra carteira
To: 0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
Amount: 0.01 SepoliaETH
```

#### 4. Ver no CryptoAML (1 min)

```
Dashboard > Transactions
✅ Ver sua transação
✅ Ver análise de risco
✅ Ver alertas (se houver)
```

**Custo:** R$ 0,00 ✅

---

## 💵 Opção 2: Mainnet com Valores Pequenos

### ✅ Vantagens
- ✅ Transações reais
- ✅ Dados reais
- ✅ Teste completo
- ✅ Custo mínimo

### 📋 Blockchains Mais Baratas

| Blockchain | Custo por TX | Tempo | Recomendado |
|------------|--------------|-------|-------------|
| **Polygon** | $0.01 | 2s | ✅ Melhor |
| **BSC** | $0.10 | 3s | ✅ Bom |
| **Avalanche** | $0.15 | 2s | ✅ Bom |
| **Arbitrum** | $0.20 | 1s | ⚠️ Ok |
| **Ethereum** | $5-50 | 15s | ❌ Caro |
| **Bitcoin** | $1-10 | 10min | ❌ Caro |

### 📋 Passo a Passo - Polygon (RECOMENDADO)

#### 1. Criar Carteira Real (5 min)

```bash
# Instalar MetaMask
https://metamask.io

# Adicionar Polygon
Network Name: Polygon Mainnet
RPC URL: https://polygon-rpc.com
Chain ID: 137
Currency: MATIC
Explorer: https://polygonscan.com
```

#### 2. Comprar MATIC (10 min)

**Opções de Compra:**

**A) Binance (Mais Barato)**
```
1. Criar conta: https://binance.com
2. Depositar R$ 50 (PIX)
3. Comprar MATIC
4. Sacar para MetaMask (Polygon Network)
Taxa: ~R$ 2
```

**B) Mercado Bitcoin**
```
1. Criar conta: https://mercadobitcoin.com.br
2. Depositar R$ 50 (PIX)
3. Comprar MATIC
4. Sacar para MetaMask
Taxa: ~R$ 3
```

**C) Comprar Direto no MetaMask**
```
MetaMask > Buy > Transak/MoonPay
Comprar: $10 MATIC
Taxa: ~$2
```

#### 3. Adicionar no CryptoAML (2 min)

```bash
# Acessar sistema
http://localhost:3000

# Wallets > Add Wallet
Blockchain: Polygon
Address: sua-carteira-polygon
Label: Minha Carteira Polygon
```

#### 4. Fazer Transações Reais (5 min)

```bash
# Transação 1: Pequena (teste)
To: 0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
Amount: 0.1 MATIC (~$0.10)
Custo: $0.01

# Transação 2: Média
To: outra-carteira
Amount: 1 MATIC (~$1)
Custo: $0.01

# Transação 3: Entre suas carteiras
From: Carteira A
To: Carteira B
Amount: 0.5 MATIC
Custo: $0.01
```

#### 5. Monitorar no CryptoAML (tempo real)

```
✅ Dashboard atualiza automaticamente
✅ Ver transações em tempo real
✅ Análise de risco
✅ Alertas automáticos
✅ Gráficos e estatísticas
```

**Custo Total:** ~R$ 50 (MATIC) + R$ 2 (taxas) = **R$ 52** ✅

---

## 🎯 Opção 3: Teste Completo Econômico

### 📋 Plano de Testes com R$ 100

#### Fase 1: Testnets (Gratuito)
```
Semana 1:
- Criar carteiras testnet
- Fazer 10+ transações
- Testar todas as features
Custo: R$ 0
```

#### Fase 2: Polygon Mainnet (R$ 52)
```
Semana 2:
- Comprar R$ 50 em MATIC
- Criar 2 carteiras
- Fazer 20 transações reais
- Monitorar no CryptoAML
Custo: R$ 52
```

#### Fase 3: Multi-Chain (R$ 48)
```
Semana 3:
- BSC: R$ 20 em BNB
- Avalanche: R$ 20 em AVAX
- Testar cross-chain
Custo: R$ 48
```

**Custo Total:** R$ 100 para teste completo ✅

---

## 🔍 O Que Testar

### ✅ Funcionalidades Básicas
- [ ] Adicionar carteira
- [ ] Ver saldo
- [ ] Ver transações
- [ ] Análise de risco
- [ ] Alertas automáticos

### ✅ Funcionalidades Avançadas
- [ ] Múltiplas carteiras
- [ ] Múltiplas blockchains
- [ ] Filtros de transações
- [ ] Exportar relatórios
- [ ] Gráficos e analytics
- [ ] Smart alerts
- [ ] Risk scoring

### ✅ Cenários de Teste

**1. Transação Normal**
```
Enviar: 0.1 MATIC
Para: carteira conhecida
Resultado esperado: Risco LOW
```

**2. Transação Suspeita (simulada)**
```
Enviar: 100 MATIC
Para: carteira nova
Resultado esperado: Risco MEDIUM/HIGH
```

**3. Múltiplas Transações**
```
Fazer 5 transações em 1 hora
Resultado esperado: Alerta de velocidade
```

**4. Cross-Chain**
```
Polygon > BSC > Avalanche
Resultado esperado: Rastreamento completo
```

---

## 💡 Dicas para Economizar

### 1. Use Testnets Primeiro
- Teste TUDO em testnet
- Só vá para mainnet quando tiver certeza
- **Economia:** 100%

### 2. Escolha Blockchains Baratas
- Polygon: $0.01/tx
- BSC: $0.10/tx
- Evite Ethereum: $5-50/tx
- **Economia:** 99%

### 3. Faça Transações em Horários de Baixa
- Madrugada: taxas menores
- Fins de semana: menos congestionamento
- **Economia:** 30-50%

### 4. Use Valores Pequenos
- Teste com $0.10 - $1
- Não precisa de valores grandes
- **Economia:** Risco mínimo

### 5. Reutilize Carteiras
- Use as mesmas carteiras
- Não crie novas a cada teste
- **Economia:** Taxas de criação

---

## 🛡️ Segurança nas Transações

### ✅ Checklist de Segurança

- [ ] Backup da seed phrase (12/24 palavras)
- [ ] Nunca compartilhar chave privada
- [ ] Verificar endereço antes de enviar
- [ ] Começar com valores pequenos
- [ ] Usar carteiras separadas (teste/produção)
- [ ] Habilitar 2FA nas exchanges
- [ ] Usar hardware wallet para valores grandes

### 🔒 Onde Guardar Seed Phrase

**✅ Seguro:**
- Papel físico em cofre
- Metal (fireproof)
- Gerenciador de senhas offline

**❌ NUNCA:**
- Cloud (Google Drive, Dropbox)
- Email
- Foto no celular
- Mensagem no WhatsApp

---

## 📊 Monitoramento em Tempo Real

### Como Funciona

```
1. Você faz transação no MetaMask
   ↓
2. Blockchain confirma (2-15s)
   ↓
3. CryptoAML detecta automaticamente
   ↓
4. Análise de risco em tempo real
   ↓
5. Dashboard atualiza
   ↓
6. Alertas (se necessário)
```

### Frequência de Atualização
- **Polygon:** 2-5 segundos
- **BSC:** 3-5 segundos
- **Ethereum:** 15-30 segundos
- **Bitcoin:** 10-60 minutos

---

## 🎯 Plano Recomendado

### Semana 1: Testnet (Gratuito)
```bash
# Criar carteira Sepolia
# Obter ETH gratuito
# Fazer 20 transações
# Testar todas as features
Custo: R$ 0
```

### Semana 2: Polygon (R$ 52)
```bash
# Comprar R$ 50 MATIC
# Fazer 30 transações reais
# Testar cenários diversos
Custo: R$ 52
```

### Semana 3: Multi-Chain (R$ 48)
```bash
# BSC + Avalanche
# Testar cross-chain
# Validar sistema completo
Custo: R$ 48
```

### Semana 4: Produção
```bash
# Sistema validado
# Pronto para clientes
# Começar marketing
Custo: R$ 0
```

**Investimento Total:** R$ 100
**Retorno:** Sistema 100% validado ✅

---

## ✅ Conclusão

### Você Pode Testar:

1. ✅ **Gratuito:** Testnets (ilimitado)
2. ✅ **Barato:** Polygon ($0.01/tx)
3. ✅ **Completo:** Multi-chain (R$ 100)
4. ✅ **Seguro:** Valores pequenos
5. ✅ **Real:** Transações verdadeiras

### Próximos Passos:

1. Começar com testnet (hoje)
2. Comprar MATIC (semana 1)
3. Fazer transações reais (semana 2)
4. Validar sistema (semana 3)
5. Lançar para clientes (semana 4)

**Investimento:** R$ 100
**Tempo:** 1 mês
**Resultado:** Sistema 100% validado com dados reais ✅

---

**CryptoAML** - Teste com segurança e economia! 🚀💰
