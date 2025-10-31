# ⚙️ Configuração do Arquivo .env

## 📝 O que é o arquivo .env?

O arquivo `.env` armazena **variáveis de ambiente** - informações sensíveis como senhas, chaves de API e configurações que **não devem** ser compartilhadas no Git.

---

## 🚀 Passo a Passo

### 1️⃣ Copiar o Arquivo de Exemplo

```bash
# Navegue até a pasta backend
cd backend

# Copie o arquivo de exemplo
copy .env.example .env
```

Ou manualmente:
1. Abra a pasta `backend`
2. Copie o arquivo `.env.example`
3. Cole na mesma pasta
4. Renomeie para `.env` (sem o .example)

---

### 2️⃣ Abrir o Arquivo .env

Abra o arquivo `.env` com qualquer editor de texto:
- Bloco de Notas
- VS Code
- Notepad++

---

### 3️⃣ Configurar as Variáveis

O arquivo terá este conteúdo:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cryptoaml?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Blockchain APIs
ETHERSCAN_API_KEY=your-etherscan-api-key
BLOCKCHAIN_INFO_API_KEY=your-blockchain-info-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔧 Configurações Obrigatórias

### DATABASE_URL (MAIS IMPORTANTE!)

Esta é a **única configuração obrigatória** para o sistema funcionar.

#### Cenário 1: Usando Docker (Recomendado)
```env
DATABASE_URL="postgresql://cryptoaml:cryptoaml123@localhost:5432/cryptoaml?schema=public"
```
✅ **Use exatamente assim!** Não precisa mudar nada.

#### Cenário 2: PostgreSQL Local com usuário postgres
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/cryptoaml?schema=public"
```
📝 Substitua `SUA_SENHA_AQUI` pela senha que você definiu ao instalar o PostgreSQL.

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/cryptoaml?schema=public"
```

#### Cenário 3: PostgreSQL Online (Supabase)
```env
DATABASE_URL="postgresql://postgres:sua-senha@db.projeto.supabase.co:5432/postgres"
```
📝 Copie a connection string do painel do Supabase.

---

### Anatomia da DATABASE_URL

```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public
           ↓       ↓      ↓    ↓         ↓
        usuário  senha  host porta  nome do banco
```

**Exemplo prático:**
```
postgresql://cryptoaml:cryptoaml123@localhost:5432/cryptoaml?schema=public
```
- **Usuário:** cryptoaml
- **Senha:** cryptoaml123
- **Host:** localhost (seu computador)
- **Porta:** 5432 (padrão do PostgreSQL)
- **Banco:** cryptoaml

---

### JWT_SECRET (Importante para Segurança)

```env
JWT_SECRET=mude-isso-para-algo-aleatorio-e-seguro
```

**Como gerar um secret seguro:**

**Opção 1: Online**
- Acesse: https://randomkeygen.com/
- Copie uma "Fort Knox Password"

**Opção 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Exemplo:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## 📋 Configurações Opcionais

Estas podem ficar com os valores padrão:

```env
# Porta do servidor (pode deixar 3001)
PORT=3001

# Ambiente (development para desenvolvimento local)
NODE_ENV=development

# Tempo de expiração do token (7 dias)
JWT_EXPIRES_IN=7d

# URL do ML Service (se rodar local, deixe assim)
ML_SERVICE_URL=http://localhost:8000

# Redis (opcional, pode deixar assim)
REDIS_HOST=localhost
REDIS_PORT=6379

# APIs de Blockchain (opcional, pode deixar vazio por enquanto)
ETHERSCAN_API_KEY=
BLOCKCHAIN_INFO_API_KEY=

# Rate Limiting (pode deixar assim)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## ✅ Exemplos Completos

### Exemplo 1: Usando Docker (Copie e Cole)

```env
DATABASE_URL="postgresql://cryptoaml:cryptoaml123@localhost:5432/cryptoaml?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:8000
ETHERSCAN_API_KEY=
BLOCKCHAIN_INFO_API_KEY=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Exemplo 2: PostgreSQL Local

```env
DATABASE_URL="postgresql://postgres:minhasenha123@localhost:5432/cryptoaml?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=meu-secret-super-seguro-123456
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:8000
ETHERSCAN_API_KEY=
BLOCKCHAIN_INFO_API_KEY=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Exemplo 3: Supabase

```env
DATABASE_URL="postgresql://postgres:sua-senha-supabase@db.abcdefgh.supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
JWT_SECRET=outro-secret-aleatorio-seguro
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:8000
ETHERSCAN_API_KEY=
BLOCKCHAIN_INFO_API_KEY=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🧪 Testar se Está Correto

Após configurar o `.env`:

```bash
cd backend

# Instalar dependências
npm install

# Testar conexão com banco
npx prisma db pull
```

**Se funcionar:** ✅ Configuração correta!
**Se der erro:** ❌ Verifique a DATABASE_URL

---

## ⚠️ Erros Comuns

### Erro: "Can't reach database server"
❌ **Problema:** DATABASE_URL incorreta ou banco não está rodando

✅ **Solução:**
1. Verifique se o PostgreSQL está rodando
2. Confira usuário, senha, host e porta na DATABASE_URL
3. Se usar Docker: `docker-compose up -d postgres`

### Erro: "Authentication failed"
❌ **Problema:** Senha incorreta na DATABASE_URL

✅ **Solução:**
1. Verifique a senha do PostgreSQL
2. Teste conectar com: `psql -U postgres`
3. Atualize a senha na DATABASE_URL

### Erro: "Database does not exist"
❌ **Problema:** Banco `cryptoaml` não foi criado

✅ **Solução:**
```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE cryptoaml;

# Saia
\q
```

---

## 🔒 Segurança

### ✅ FAÇA:
- Mantenha o `.env` no `.gitignore`
- Use senhas fortes
- Gere JWT_SECRET aleatório
- Nunca compartilhe o arquivo `.env`

### ❌ NÃO FAÇA:
- Não commite o `.env` no Git
- Não use senhas simples como "123456"
- Não compartilhe suas credenciais
- Não use o mesmo `.env` em produção

---

## 📝 Checklist Final

- [ ] Arquivo `.env` criado na pasta `backend`
- [ ] DATABASE_URL configurada corretamente
- [ ] JWT_SECRET alterado para algo seguro
- [ ] Testado com `npx prisma db pull`
- [ ] Backend inicia sem erros

---

## 🆘 Ainda com Dúvidas?

### Solução Mais Simples:

**Use Docker e copie este .env exatamente:**

```env
DATABASE_URL="postgresql://cryptoaml:cryptoaml123@localhost:5432/cryptoaml?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=desenvolvimento-local-secret-123
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:8000
ETHERSCAN_API_KEY=
BLOCKCHAIN_INFO_API_KEY=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Depois execute:
```bash
docker-compose up -d
```

**Pronto! Tudo funcionando!** 🚀
