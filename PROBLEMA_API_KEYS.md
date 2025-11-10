# 🔴 PROBLEMA: API Keys Incompletas

## ❌ Problema Identificado

As chaves de API no arquivo `backend/.env` estão **incompletas**, por isso:
- ✅ As carteiras são adicionadas com sucesso
- ❌ A sincronização falha (Transactions: 0, Alerts: 0)
- ❌ O backend não consegue buscar dados das blockchains

## 🔍 Chaves Atuais (INVÁLIDAS)

```env
ETHERSCAN_API_KEY=649EM4JUJIVV2J8F1IM13QZP1FIG1HZ4H2  ❌ Incompleta
ALCHEMY_API_KEY=LO4rb75qOoa_9s7ZW8KBL                ❌ Incompleta
```

## ✅ Solução em 3 Passos

### Passo 1: Obter Chaves Completas

#### Etherscan (Obrigatória)
1. Acesse: https://etherscan.io/register
2. Crie uma conta gratuita
3. Vá em: https://etherscan.io/myapikey
4. Crie uma nova API key
5. Copie a chave completa (34 caracteres)

**Exemplo de chave válida:**
```
YourApiKeyToken1234567890abcdefgh
```

#### Alchemy (Obrigatória para Sepolia)
1. Acesse: https://www.alchemy.com/
2. Crie uma conta gratuita
3. Crie um novo App para "Ethereum Sepolia"
4. Copie a API Key completa (32+ caracteres)

**Exemplo de chave válida:**
```
abcdefghijklmnopqrstuvwxyz123456
```

### Passo 2: Atualizar o .env

Edite o arquivo `backend/.env`:

```env
# Substitua com suas chaves COMPLETAS
ETHERSCAN_API_KEY=SUA_CHAVE_ETHERSCAN_COMPLETA_AQUI
ALCHEMY_API_KEY=SUA_CHAVE_ALCHEMY_COMPLETA_AQUI
```

### Passo 3: Reiniciar o Backend

```bash
# Pare o backend (Ctrl+C)
# Inicie novamente
cd backend
npm run dev
```

## 🎯 Alternativa: Usar Interface Web

Você também pode configurar as chaves através da interface:

1. Acesse: http://localhost:3000
2. Faça login
3. Vá em **"API Keys"** no menu
4. Clique em **"Adicionar Chave"**
5. Escolha o provedor (Etherscan ou Alchemy)
6. Cole a chave completa
7. Clique em **"Salvar Configuração"**

## ✅ Como Verificar se Funcionou

Após configurar as chaves:

1. Vá em **"Wallets"**
2. Clique no botão **"Sync"** (ícone ↻) em uma carteira
3. Aguarde alguns segundos
4. Os números devem atualizar:
   - Transactions: X (não mais 0)
   - Alerts: X (se houver alertas)

## 🆓 Limites Gratuitos

### Etherscan Free Tier
- ✅ 5 requisições/segundo
- ✅ 100.000 requisições/dia
- ✅ Suficiente para MVP

### Alchemy Free Tier
- ✅ 300M compute units/mês
- ✅ ~3M requisições/mês
- ✅ Suficiente para MVP

## 🚨 Importante

- As chaves gratuitas são suficientes para desenvolvimento
- Nunca compartilhe suas chaves em repositórios públicos
- Bitcoin funciona sem API key (usa Blockstream API pública)

## 📞 Suporte

Se o problema persistir após configurar as chaves:
1. Verifique o console do backend para erros
2. Verifique o console do navegador (F12)
3. Teste as chaves manualmente nos sites dos provedores
