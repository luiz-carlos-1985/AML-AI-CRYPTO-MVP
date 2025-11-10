# 🚀 Solução Rápida - Sistema Não Funciona

## ❌ Problema

**A função principal do sistema (monitoramento de transações blockchain) não funciona.**

## ✅ Solução em 3 Passos

### 1️⃣ Obter API Keys (5 minutos)

#### Etherscan API Key
1. Acesse: https://etherscan.io/register
2. Crie uma conta (email + senha)
3. Confirme o email
4. Vá em: https://etherscan.io/myapikey
5. Clique em "Add" para criar uma nova API key
6. Copie a chave completa (34 caracteres)

#### Alchemy API Key
1. Acesse: https://www.alchemy.com/
2. Clique em "Sign Up" (pode usar Google/GitHub)
3. Crie um novo App:
   - Name: "CryptoAML Sepolia"
   - Chain: "Ethereum"
   - Network: "Sepolia"
4. Copie a "API KEY" (32+ caracteres)

### 2️⃣ Configurar as Chaves

Edite o arquivo `backend/.env`:

```env
# Substitua com suas chaves COMPLETAS
ETHERSCAN_API_KEY=SUA_CHAVE_ETHERSCAN_AQUI
ALCHEMY_API_KEY=SUA_CHAVE_ALCHEMY_AQUI
```

### 3️⃣ Validar e Iniciar

```bash
# Validar as chaves
cd backend
npm run validate:apikeys

# Se tudo estiver OK, inicie o backend
npm run dev
```

## 🧪 Testar o Sistema

1. Acesse o frontend: http://localhost:3000
2. Faça login
3. Vá em "Wallets"
4. Adicione uma carteira de teste:
   - **Endereço:** `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - **Blockchain:** Sepolia
   - **Label:** Teste
5. Clique no botão de "Sync" (ícone de refresh)
6. Aguarde 5-10 segundos
7. Recarregue a página
8. Você deve ver transações aparecendo!

## 📊 O Que Deve Funcionar Agora

✅ Adicionar carteiras  
✅ Sincronizar transações  
✅ Análise de risco automática  
✅ Geração de alertas  
✅ Dashboard com métricas  
✅ Relatórios  

## ⚠️ Importante

- **Nunca compartilhe suas API keys** em repositórios públicos
- As chaves gratuitas têm limites suficientes para desenvolvimento
- Bitcoin funciona sem API key (usa API pública Blockstream)

## 🆘 Ainda Não Funciona?

### Erro: "ECONNREFUSED"
- ✅ Certifique-se que o backend está rodando na porta 3001
- ✅ Execute: `cd backend && npm run dev`

### Erro: "Invalid API key"
- ✅ Verifique se copiou a chave completa (sem espaços)
- ✅ Execute: `npm run validate:apikeys` para testar

### Erro: "Wallet not found"
- ✅ Certifique-se que o PostgreSQL está rodando
- ✅ Execute: `npx prisma migrate dev`

### Nenhuma transação aparece
- ✅ Use o endereço de teste fornecido acima
- ✅ Aguarde 10-15 segundos após clicar em "Sync"
- ✅ Verifique os logs do backend para erros

## 📚 Documentação Completa

- [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) - Guia detalhado de API keys
- [QUICKSTART.md](./QUICKSTART.md) - Guia completo de instalação
- [README.md](./README.md) - Documentação geral

## 💬 Suporte

Se ainda tiver problemas, verifique:
1. Logs do backend: `cd backend && npm run dev`
2. Console do navegador (F12)
3. Arquivo `.env` está correto
4. PostgreSQL está rodando
5. Porta 3001 está livre
