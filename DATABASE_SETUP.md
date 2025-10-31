# 🗄️ Configuração do Banco de Dados - CryptoAML

## 📋 Opções de Banco de Dados

### Opção 1: PostgreSQL com Docker (Recomendado - Mais Fácil)

```bash
# Inicie o PostgreSQL via Docker Compose
docker-compose up -d postgres

# Aguarde 10 segundos para o banco iniciar
# O banco já estará configurado e pronto!
```

**Credenciais padrão:**
- Host: localhost
- Port: 5432
- Database: cryptoaml
- User: cryptoaml
- Password: cryptoaml123

---

### Opção 2: PostgreSQL Local (Windows)

#### Passo 1: Instalar PostgreSQL

**Download:**
https://www.postgresql.org/download/windows/

**Instalação:**
1. Execute o instalador
2. Senha do superusuário: `postgres` (anote!)
3. Porta: `5432` (padrão)
4. Locale: `Portuguese, Brazil`

#### Passo 2: Criar Banco de Dados

**Via pgAdmin (GUI):**
1. Abra pgAdmin
2. Conecte ao servidor local
3. Clique direito em "Databases" → "Create" → "Database"
4. Nome: `cryptoaml`
5. Owner: `postgres`
6. Save

**Via Terminal:**
```bash
# Abra o SQL Shell (psql)
# Pressione Enter para aceitar os padrões
# Digite a senha: postgres

# Crie o banco
CREATE DATABASE cryptoaml;

# Crie um usuário (opcional)
CREATE USER cryptoaml WITH PASSWORD 'cryptoaml123';
GRANT ALL PRIVILEGES ON DATABASE cryptoaml TO cryptoaml;

# Saia
\q
```

#### Passo 3: Configurar .env

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Se usar usuário postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cryptoaml?schema=public"

# OU se criou usuário cryptoaml
DATABASE_URL="postgresql://cryptoaml:cryptoaml123@localhost:5432/cryptoaml?schema=public"
```

---

### Opção 3: PostgreSQL Online (Gratuito)

#### Supabase (Recomendado)

1. Acesse: https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote as credenciais em "Project Settings" → "Database"

**Configure o .env:**
```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres"
```

#### Neon (Alternativa)

1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string

**Configure o .env:**
```env
DATABASE_URL="postgresql://[usuario]:[senha]@[host]/[database]?sslmode=require"
```

---

## 🚀 Executar Migrations

Após configurar o banco, execute:

```bash
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar migrations (cria as tabelas)
npx prisma migrate dev --name init

# Verificar se funcionou
npx prisma studio
```

O comando `prisma studio` abrirá uma interface web em http://localhost:5555 onde você pode ver as tabelas criadas.

---

## ✅ Verificar Conexão

### Teste 1: Prisma Studio
```bash
cd backend
npx prisma studio
```
Se abrir o navegador, está funcionando! ✅

### Teste 2: Query Direta
```bash
cd backend
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Conectado!')).catch(e => console.log('❌ Erro:', e.message))"
```

### Teste 3: Iniciar Backend
```bash
cd backend
npm run dev
```
Se não houver erros de conexão, está funcionando! ✅

---

## 🌱 Popular com Dados de Teste (Opcional)

Crie o arquivo `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@cryptoaml.com',
      password: hashedPassword,
      name: 'Demo User',
      company: 'CryptoAML Demo',
      plan: 'GROWTH'
    }
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar carteira de exemplo
  const wallet = await prisma.wallet.create({
    data: {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      blockchain: 'BITCOIN',
      label: 'Satoshi Wallet',
      userId: user.id,
      riskScore: 15.5,
      riskLevel: 'LOW'
    }
  });

  console.log('✅ Carteira criada:', wallet.address);

  // Criar transação de exemplo
  const transaction = await prisma.transaction.create({
    data: {
      hash: '0x1234567890abcdef',
      walletId: wallet.id,
      blockchain: 'BITCOIN',
      fromAddress: wallet.address,
      toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      amount: 0.5,
      timestamp: new Date(),
      riskScore: 20,
      riskLevel: 'LOW',
      flags: [],
      analyzed: true
    }
  });

  console.log('✅ Transação criada:', transaction.hash);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📧 Email: demo@cryptoaml.com');
  console.log('🔑 Senha: password123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Adicione ao `backend/package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Execute:
```bash
cd backend
npm install -D ts-node
npx prisma db seed
```

---

## 🔧 Troubleshooting

### Erro: "Can't reach database server"

**Solução 1:** Verificar se PostgreSQL está rodando
```bash
# Windows (Services)
services.msc
# Procure por "postgresql" e inicie o serviço

# Ou via Docker
docker-compose ps
docker-compose up -d postgres
```

**Solução 2:** Verificar credenciais no .env
```bash
# Teste a conexão
psql -U postgres -d cryptoaml
# Se pedir senha, use a que você configurou
```

### Erro: "Database does not exist"

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE cryptoaml;

# Saia
\q
```

### Erro: "SSL connection required"

Para bancos online (Supabase, Neon), adicione `?sslmode=require`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Erro: "Migration failed"

```bash
# Resetar banco (CUIDADO: apaga tudo!)
cd backend
npx prisma migrate reset

# Ou criar do zero
npx prisma migrate dev --name init
```

---

## 📊 Comandos Úteis

```bash
# Ver tabelas criadas
npx prisma studio

# Resetar banco (apaga tudo)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate

# Formatar schema
npx prisma format
```

---

## 🎯 Checklist Final

- [ ] PostgreSQL instalado ou Docker rodando
- [ ] Banco `cryptoaml` criado
- [ ] Arquivo `.env` configurado com DATABASE_URL
- [ ] `npm install` executado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado sem erros
- [ ] `npx prisma studio` abre no navegador
- [ ] Backend inicia sem erros de conexão

---

## 🆘 Ainda com Problemas?

### Opção Mais Simples: Use Docker!

```bash
# Na raiz do projeto
docker-compose up -d

# Pronto! Banco configurado automaticamente
# Acesse: http://localhost:3000
```

O Docker Compose já configura:
- ✅ PostgreSQL
- ✅ Backend
- ✅ Frontend
- ✅ ML Service
- ✅ Migrations automáticas

**Tudo funcionando em 1 comando!** 🚀
