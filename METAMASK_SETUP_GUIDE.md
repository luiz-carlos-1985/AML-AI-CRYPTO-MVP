# 🦊 Guia Completo: MetaMask + Sepolia + CryptoAML

## 🎯 Objetivo
Configurar MetaMask, obter ETH gratuito e testar o CryptoAML em **15 minutos**.

---

## 📋 PASSO 1: Instalar MetaMask (3 minutos)

### Windows/Mac/Linux

#### 1.1 Baixar MetaMask
```
🌐 Acesse: https://metamask.io/download/

✅ Clique em "Install MetaMask for Chrome"
   (ou Firefox/Brave/Edge)

✅ Clique em "Add to Chrome"

✅ Clique em "Add Extension"
```

#### 1.2 Criar Carteira Nova

```
✅ Clique no ícone da raposa (canto superior direito)

✅ Clique em "Create a new wallet"

✅ Clique em "I agree" (termos)

✅ Criar senha forte (mínimo 8 caracteres)
   Exemplo: CryptoAML@2024!

✅ Clique em "Create a new wallet"
```

#### 1.3 IMPORTANTE: Guardar Seed Phrase

```
⚠️  ATENÇÃO: Esta é a parte MAIS IMPORTANTE!

✅ Clique em "Secure my wallet"

✅ Clique em "Reveal Secret Recovery Phrase"

✅ COPIE as 12 palavras e guarde em local SEGURO:
   - Anote em papel
   - Guarde em cofre
   - NUNCA compartilhe
   - NUNCA tire foto
   - NUNCA salve no computador

Exemplo de seed phrase:
word1 word2 word3 word4 word5 word6
word7 word8 word9 word10 word11 word12

✅ Clique em "Next"

✅ Confirme as palavras na ordem correta

✅ Clique em "Confirm"

✅ Clique em "Got it!"
```

#### 1.4 Pronto! MetaMask Instalado ✅

```
Você verá:
- Saldo: 0 ETH
- Rede: Ethereum Mainnet
- Endereço: 0x... (sua carteira)
```

---

## 📋 PASSO 2: Adicionar Rede Sepolia (2 minutos)

### 2.1 Abrir Configurações de Rede

```
✅ Clique no ícone MetaMask

✅ Clique na rede atual (topo, "Ethereum Mainnet")

✅ Clique em "Add network"

✅ Clique em "Add a network manually"
```

### 2.2 Configurar Sepolia

```
Preencha os campos:

Network Name:
Sepolia

New RPC URL:
https://rpc.sepolia.org

Chain ID:
11155111

Currency Symbol:
ETH

Block Explorer URL:
https://sepolia.etherscan.io

✅ Clique em "Save"

✅ Clique em "Switch to Sepolia"
```

### 2.3 Verificar

```
✅ Topo do MetaMask deve mostrar: "Sepolia"
✅ Saldo: 0 SepoliaETH
✅ Pronto para receber ETH de teste!
```

---

## 📋 PASSO 3: Obter ETH Gratuito (5 minutos)

### 3.1 Copiar Seu Endereço

```
✅ Abrir MetaMask

✅ Clicar no endereço (0x...)

✅ Endereço copiado! (aparece "Copied!")

Exemplo: 0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
```

### 3.2 Usar Faucets (Torneiras Gratuitas)

#### Opção A: Alchemy Faucet (RECOMENDADO)

```
🌐 Acesse: https://www.alchemy.com/faucets/ethereum-sepolia

✅ Criar conta gratuita (se não tiver)
   - Email
   - Senha
   - Confirmar email

✅ Fazer login

✅ Colar seu endereço MetaMask

✅ Clicar em "Send Me ETH"

✅ Aguardar 10-30 segundos

✅ Receber: 0.5 SepoliaETH ✅
```

#### Opção B: QuickNode Faucet

```
🌐 Acesse: https://faucet.quicknode.com/ethereum/sepolia

✅ Conectar com Twitter/Discord (verificação)

✅ Colar seu endereço

✅ Clicar em "Continue"

✅ Receber: 0.1 SepoliaETH ✅
```

#### Opção C: Sepolia Faucet

```
🌐 Acesse: https://sepoliafaucet.com

✅ Colar seu endereço

✅ Clicar em "Send Me ETH"

✅ Receber: 0.5 SepoliaETH ✅
```

### 3.3 Verificar Saldo

```
✅ Abrir MetaMask

✅ Verificar saldo: 0.5 SepoliaETH (ou mais)

✅ Se não aparecer, aguardar 1-2 minutos

✅ Atualizar página se necessário
```

---

## 📋 PASSO 4: Fazer Transações de Teste (3 minutos)

### 4.1 Primeira Transação

```
✅ Abrir MetaMask

✅ Clicar em "Send"

✅ Colar endereço de destino:
   0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a

✅ Valor: 0.01 ETH

✅ Clicar em "Next"

✅ Verificar:
   - Endereço correto
   - Valor correto
   - Taxa: ~$0.00 (gratuito)

✅ Clicar em "Confirm"

✅ Aguardar 10-30 segundos

✅ Transação confirmada! ✅
```

### 4.2 Ver Transação no Explorer

```
✅ Clicar na transação no MetaMask

✅ Clicar em "View on block explorer"

✅ Ver detalhes completos:
   - Hash da transação
   - Status: Success
   - Block number
   - Timestamp
   - Gas usado
```

### 4.3 Fazer Mais Transações

```
Repita o processo:

Transação 2: 0.05 ETH
Transação 3: 0.1 ETH
Transação 4: 0.02 ETH
Transação 5: 0.03 ETH

Total gasto: ~0.21 ETH
Restante: ~0.29 ETH
Custo: R$ 0,00 ✅
```

---

## 📋 PASSO 5: Monitorar no CryptoAML (2 minutos)

### 5.1 Iniciar CryptoAML

```bash
# Opção A: Docker (Recomendado)
cd c:\PROJETOS\aml-crypto-mvp-complete
docker-compose up -d

# Opção B: Manual
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### 5.2 Acessar Sistema

```
🌐 Abrir: http://localhost:3000

✅ Fazer login (ou criar conta)
   Email: seu@email.com
   Senha: sua-senha
```

### 5.3 Adicionar Carteira

```
✅ Clicar em "Wallets" (menu lateral)

✅ Clicar em "Add Wallet"

✅ Preencher:
   Blockchain: Ethereum (Sepolia)
   Address: [colar endereço MetaMask]
   Label: Minha Carteira Teste

✅ Clicar em "Add Wallet"

✅ Carteira adicionada! ✅
```

### 5.4 Ver Transações

```
✅ Ir para "Dashboard"

✅ Ver métricas:
   - Total Wallets: 1
   - Transactions: 5
   - Alerts: 0
   - Risk Level: LOW

✅ Ir para "Transactions"

✅ Ver lista de transações:
   - Hash
   - Amount
   - Risk Level
   - Timestamp

✅ Clicar em uma transação

✅ Ver detalhes completos:
   - Análise de risco
   - Fatores de risco
   - Recomendações
```

### 5.5 Testar Outras Features

```
✅ Analytics:
   - Ver gráficos
   - AI Risk Analysis
   - Geographic Heatmap

✅ Tools:
   - Smart Alerts
   - Blockchain Explorer
   - Risk Scoring

✅ Reports:
   - Gerar relatório PDF
   - Exportar CSV
   - Compliance reports

✅ Integrations:
   - Criar API Key
   - Configurar Webhook
```

---

## 🎯 Checklist Completo

### ✅ MetaMask
- [x] Extensão instalada
- [x] Carteira criada
- [x] Seed phrase guardada
- [x] Rede Sepolia adicionada
- [x] ETH recebido (0.5+)

### ✅ Transações
- [x] 5+ transações feitas
- [x] Confirmadas no blockchain
- [x] Visíveis no explorer

### ✅ CryptoAML
- [x] Sistema rodando
- [x] Conta criada
- [x] Carteira adicionada
- [x] Transações visíveis
- [x] Dashboard funcionando
- [x] Todas as features testadas

---

## 🆘 Problemas Comuns e Soluções

### ❌ MetaMask não instala

**Solução:**
```
1. Usar Chrome/Brave/Firefox atualizado
2. Desabilitar outras extensões de carteira
3. Limpar cache do browser
4. Tentar em modo anônimo
```

### ❌ Não recebo ETH do faucet

**Solução:**
```
1. Verificar se está na rede Sepolia
2. Tentar outro faucet
3. Aguardar 24h e tentar novamente
4. Usar VPN se estiver bloqueado
```

### ❌ Transação não confirma

**Solução:**
```
1. Aguardar 2-3 minutos
2. Verificar no explorer
3. Aumentar gas fee (se necessário)
4. Tentar novamente
```

### ❌ CryptoAML não mostra transações

**Solução:**
```
1. Verificar se backend está rodando
2. Verificar se endereço está correto
3. Aguardar sincronização (1-2 min)
4. Atualizar página (F5)
```

---

## 💡 Dicas Profissionais

### 🔒 Segurança

```
✅ SEMPRE guardar seed phrase em papel
✅ NUNCA compartilhar chave privada
✅ Usar senha forte no MetaMask
✅ Habilitar bloqueio automático
✅ Verificar endereços antes de enviar
```

### 💰 Economia

```
✅ Usar testnets para testes (gratuito)
✅ Fazer múltiplas transações de uma vez
✅ Testar em horários de baixa (madrugada)
✅ Usar blockchains baratas (Polygon, BSC)
```

### 📊 Testes

```
✅ Fazer pelo menos 10 transações
✅ Testar diferentes valores
✅ Testar diferentes horários
✅ Simular cenários suspeitos
✅ Validar todos os alertas
```

---

## 🎓 Próximos Passos

### Após Testar com Sepolia

```
1. ✅ Validar todas as funcionalidades
2. ✅ Corrigir bugs encontrados
3. ✅ Otimizar performance
4. ✅ Preparar para mainnet
```

### Ir para Mainnet (Polygon)

```
1. Comprar MATIC (R$ 50)
2. Adicionar rede Polygon
3. Fazer transações reais
4. Monitorar no CryptoAML
5. Validar com dados reais
```

### Lançar para Produção

```
1. Deploy em servidor
2. Configurar domínio
3. SSL/HTTPS
4. Monitoramento
5. Marketing
```

---

## 📞 Suporte

### Recursos Úteis

```
📚 MetaMask Docs: https://docs.metamask.io
📚 Sepolia Faucets: https://faucetlink.to/sepolia
📚 Etherscan Sepolia: https://sepolia.etherscan.io
📚 CryptoAML Docs: README.md
```

### Comunidades

```
💬 MetaMask Discord: https://discord.gg/metamask
💬 Ethereum Reddit: r/ethereum
💬 Web3 Brasil: Telegram/Discord
```

---

## ✅ Conclusão

Você agora tem:

- ✅ MetaMask configurado
- ✅ Rede Sepolia ativa
- ✅ ETH gratuito para testes
- ✅ Transações reais feitas
- ✅ CryptoAML monitorando

**Tempo total:** 15 minutos
**Custo total:** R$ 0,00
**Resultado:** Sistema 100% testado ✅

---

**Próximo passo:** Fazer 10+ transações e testar todas as features do CryptoAML! 🚀

**CryptoAML** - Teste profissionalmente sem gastar nada! 💚
