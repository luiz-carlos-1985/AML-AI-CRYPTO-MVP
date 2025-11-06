# 🧪 Guia de Testes - Gratuito e Econômico

## 🎯 Objetivo
Testar o CryptoAML de forma completa, profissional e **sem gastar nada** antes de ir para produção.

---

## 💰 Opção 1: Teste Local (100% GRATUITO)

### ✅ Vantagens
- ✅ Totalmente gratuito
- ✅ Sem limites de uso
- ✅ Controle total
- ✅ Dados privados

### 📋 Passo a Passo

#### 1. Instalar Dependências (5 min)
```bash
# Instalar Node.js 20+ (gratuito)
# Download: https://nodejs.org

# Instalar PostgreSQL (gratuito)
# Download: https://www.postgresql.org/download/

# Clonar projeto
cd c:\PROJETOS\aml-crypto-mvp-complete

# Instalar dependências
npm run install:all
```

#### 2. Configurar Database (2 min)
```bash
cd backend
cp .env.example .env

# Editar .env com suas credenciais locais
# DATABASE_URL="postgresql://postgres:senha@localhost:5432/cryptoaml"

# Criar database
npx prisma migrate dev
```

#### 3. Iniciar Sistema (1 min)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 4. Testar (30 min)
```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:3001
✅ Health: http://localhost:3001/health
```

**Checklist de Testes:**
- [ ] Criar conta
- [ ] Fazer login
- [ ] Adicionar carteira
- [ ] Ver transações
- [ ] Criar alerta
- [ ] Gerar relatório
- [ ] Testar todas as páginas
- [ ] Testar em mobile (F12 > Device toolbar)
- [ ] Testar dark/light theme
- [ ] Testar idiomas

**Custo:** R$ 0,00 ✅

---

## 💰 Opção 2: Docker Local (100% GRATUITO)

### ✅ Vantagens
- ✅ Totalmente gratuito
- ✅ Ambiente isolado
- ✅ Fácil de limpar
- ✅ Igual à produção

### 📋 Passo a Passo

#### 1. Instalar Docker (5 min)
```bash
# Download Docker Desktop (gratuito)
# Windows: https://www.docker.com/products/docker-desktop
# Instalar e reiniciar
```

#### 2. Iniciar Sistema (2 min)
```bash
cd c:\PROJETOS\aml-crypto-mvp-complete

# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

#### 3. Testar (30 min)
```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:3001
✅ Database: localhost:5432
```

#### 4. Limpar (1 min)
```bash
# Parar tudo
docker-compose down

# Limpar volumes (opcional)
docker-compose down -v
```

**Custo:** R$ 0,00 ✅

---

## 💰 Opção 3: Cloud Gratuito (FREE TIER)

### 🌐 Render.com (RECOMENDADO)

#### ✅ Vantagens
- ✅ 750h/mês gratuito
- ✅ Deploy automático
- ✅ SSL grátis
- ✅ URL pública
- ✅ Fácil de usar

#### 📋 Passo a Passo

1. **Criar conta** (gratuito)
   - Ir para https://render.com
   - Sign up com GitHub

2. **Deploy Backend** (5 min)
   ```
   New > Web Service
   - Repository: seu-repo
   - Branch: main
   - Root Directory: backend
   - Build Command: npm install && npx prisma generate
   - Start Command: npm start
   - Plan: Free
   ```

3. **Deploy Frontend** (5 min)
   ```
   New > Static Site
   - Repository: seu-repo
   - Branch: main
   - Root Directory: frontend
   - Build Command: npm install && npm run build
   - Publish Directory: dist
   - Plan: Free
   ```

4. **Database** (gratuito)
   ```
   New > PostgreSQL
   - Name: cryptoaml-db
   - Plan: Free (90 dias)
   ```

**Custo:** R$ 0,00 por 90 dias ✅

---

### 🌐 Railway.app

#### ✅ Vantagens
- ✅ $5 crédito grátis
- ✅ Deploy fácil
- ✅ Database incluído

#### 📋 Passo a Passo

1. Criar conta: https://railway.app
2. New Project > Deploy from GitHub
3. Adicionar PostgreSQL
4. Deploy automático

**Custo:** R$ 0,00 (crédito inicial) ✅

---

### 🌐 Vercel (Frontend) + Supabase (Database)

#### ✅ Vantagens
- ✅ 100% gratuito
- ✅ Performance excelente
- ✅ SSL automático

#### 📋 Passo a Passo

**Frontend (Vercel):**
1. https://vercel.com
2. Import Git Repository
3. Framework: Vite
4. Deploy

**Database (Supabase):**
1. https://supabase.com
2. New Project
3. Copiar connection string
4. Usar no backend

**Custo:** R$ 0,00 ✅

---

## 💰 Opção 4: AWS Free Tier (12 meses grátis)

### ✅ Vantagens
- ✅ 12 meses gratuito
- ✅ Infraestrutura profissional
- ✅ Escalável

### 📋 Recursos Gratuitos

- **EC2:** 750h/mês (t2.micro)
- **RDS:** 750h/mês (db.t2.micro)
- **S3:** 5GB storage
- **CloudFront:** 50GB transfer

### 📋 Passo a Passo

1. Criar conta AWS
2. Lançar EC2 t2.micro
3. Instalar Docker
4. Deploy com docker-compose

**Custo:** R$ 0,00 por 12 meses ✅

---

## 🧪 Testes Automatizados (GRATUITO)

### 1. Testes Unitários
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### 2. Testes E2E (Cypress)
```bash
cd frontend
npx cypress open
```

### 3. Validação Automática
```bash
npm run validate
```

**Custo:** R$ 0,00 ✅

---

## 📊 Ferramentas de Teste Gratuitas

### 1. Lighthouse (Performance)
```bash
# Chrome DevTools > Lighthouse
# Testar performance, SEO, acessibilidade
```

### 2. GTmetrix (Speed Test)
```
https://gtmetrix.com
# Testar velocidade do site
```

### 3. SSL Labs (Security)
```
https://www.ssllabs.com/ssltest/
# Testar segurança SSL
```

### 4. OWASP ZAP (Security)
```
https://www.zaproxy.org/
# Testar vulnerabilidades
```

**Custo:** R$ 0,00 ✅

---

## 👥 Testes com Usuários (GRATUITO)

### 1. Amigos e Família
- Pedir para 5-10 pessoas testarem
- Coletar feedback
- Anotar problemas

### 2. Comunidades Online
- Reddit (r/webdev, r/SaaS)
- Discord (dev communities)
- LinkedIn (pedir feedback)

### 3. Beta Testers
- Oferecer acesso gratuito
- Em troca de feedback detalhado

**Custo:** R$ 0,00 ✅

---

## 📋 Checklist de Testes Completo

### Funcionalidade (30 min)
- [ ] Todas as páginas carregam
- [ ] Login/Register funciona
- [ ] CRUD de carteiras
- [ ] CRUD de transações
- [ ] Sistema de alertas
- [ ] Geração de relatórios
- [ ] API Keys
- [ ] Webhooks
- [ ] Todas as ferramentas

### Performance (10 min)
- [ ] Lighthouse Score > 90
- [ ] First Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] API Response < 200ms

### Segurança (10 min)
- [ ] HTTPS funciona
- [ ] JWT tokens seguros
- [ ] Rate limiting ativo
- [ ] Input validation
- [ ] XSS prevention

### Mobile (10 min)
- [ ] Responsivo em todos os tamanhos
- [ ] Touch targets adequados
- [ ] Navegação mobile funciona
- [ ] PWA installable

### Browsers (10 min)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 💡 Recomendação Final

### 🥇 Melhor Opção: Teste Local + Render.com

**Fase 1: Desenvolvimento (Local)**
```bash
# Testar localmente primeiro
docker-compose up -d
# Testar tudo por 1-2 semanas
```

**Fase 2: Beta (Render.com)**
```bash
# Deploy gratuito no Render
# Compartilhar com beta testers
# Coletar feedback por 1 mês
```

**Fase 3: Produção (AWS/DigitalOcean)**
```bash
# Após validação, ir para produção
# Começar com plano básico
```

---

## 💰 Resumo de Custos

| Opção | Custo | Duração | Recomendado |
|-------|-------|---------|-------------|
| **Local** | R$ 0 | Ilimitado | ✅ Sim |
| **Docker Local** | R$ 0 | Ilimitado | ✅ Sim |
| **Render.com** | R$ 0 | 90 dias | ✅ Sim |
| **Railway** | R$ 0 | Crédito inicial | ⚠️ Limitado |
| **Vercel + Supabase** | R$ 0 | Ilimitado | ✅ Sim |
| **AWS Free Tier** | R$ 0 | 12 meses | ✅ Sim |

---

## 🎯 Plano de Testes Recomendado

### Semana 1-2: Testes Locais
- Testar todas as funcionalidades
- Corrigir bugs
- Otimizar performance

### Semana 3-4: Deploy Gratuito
- Deploy no Render.com
- Testes com usuários reais
- Coletar feedback

### Semana 5-6: Ajustes Finais
- Implementar melhorias
- Testes de carga
- Preparar produção

### Semana 7: Produção
- Deploy em servidor pago
- Monitoramento ativo
- Suporte aos usuários

---

## ✅ Conclusão

**Você pode testar TUDO de forma 100% gratuita por até 3 meses!**

1. ✅ Teste local (gratuito, ilimitado)
2. ✅ Deploy gratuito (Render/Vercel)
3. ✅ Testes automatizados (gratuito)
4. ✅ Beta testers (gratuito)
5. ✅ Ferramentas de análise (gratuito)

**Custo Total:** R$ 0,00 ✅

Só pague por hospedagem quando tiver clientes pagantes!

---

**CryptoAML** - Teste profissionalmente sem gastar nada! 🚀
