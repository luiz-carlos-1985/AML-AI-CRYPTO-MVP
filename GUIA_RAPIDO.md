# 🚀 Guia Rápido - CryptoAML

## ⚡ Iniciar o Sistema

### Opção 1: Tudo de Uma Vez (Recomendado)
```bash
INICIAR_SISTEMA.bat
```
Isso abrirá 2 janelas:
- Backend na porta 3001
- Frontend na porta 3000

### Opção 2: Separadamente
```bash
# Terminal 1 - Backend
START_BACKEND.bat

# Terminal 2 - Frontend  
START_FRONTEND.bat
```

## 🔑 Configurar API Keys

1. Acesse: http://localhost:3000
2. Faça login
3. Clique em **"API Keys"** no menu
4. Clique em **"Adicionar Chave"**
5. Escolha o provedor (Etherscan ou Alchemy)
6. Clique no link para obter a chave gratuita
7. Copie a chave e cole no campo
8. Clique em **"Salvar Configuração"**

## 📋 Provedores Necessários

### Etherscan (Obrigatório)
- **Uso:** Ethereum, Polygon, BSC, Arbitrum, Optimism
- **Obter em:** https://etherscan.io/apis
- **Plano Gratuito:** 100k requisições/dia
- **Tempo:** 2 minutos

### Alchemy (Obrigatório para Sepolia)
- **Uso:** Ethereum Sepolia (testnet)
- **Obter em:** https://www.alchemy.com/
- **Plano Gratuito:** 300M compute units/mês
- **Tempo:** 3 minutos

## ✅ Verificar se Está Funcionando

1. Vá em **"Wallets"**
2. Adicione uma carteira de teste:
   - Endereço: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Blockchain: Sepolia
3. Clique em **"Sync"** (ícone de refresh)
4. Aguarde alguns segundos
5. As transações devem aparecer ✅

## 🆘 Problemas Comuns

### Backend não conecta
```bash
# Verifique se está rodando na porta 3001
# Abra: http://localhost:3001/health
# Deve retornar: {"status":"ok"}
```

### Frontend não carrega
```bash
# Verifique se está rodando na porta 3000
# Limpe o cache do navegador (Ctrl+Shift+Delete)
```

### API Keys não funcionam
1. Verifique se copiou a chave completa
2. Teste a chave clicando em "Testar"
3. Certifique-se que a API está "Ativa"

## 📱 Acessar o Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔒 Segurança

- Todas as API keys são criptografadas com AES-256
- Nunca compartilhe suas chaves
- As chaves são usadas apenas para buscar dados blockchain

## 💡 Dicas

- Use Ctrl+C para parar os servidores
- Mantenha as duas janelas abertas enquanto usa o sistema
- Configure as API keys antes de adicionar carteiras
