# ⚡ Comandos Úteis - CryptoAML

## 🚀 Início Rápido

### Docker (Recomendado)
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reconstruir após mudanças
docker-compose up -d --build
```

---

## 📦 Instalação

### Instalar Todas as Dependências
```bash
# Raiz do projeto
npm run install:all

# Ou manualmente:
cd backend && npm install
cd ../frontend && npm install
cd ../ml-service && pip install -r requirements.txt
```

---

## 🔧 Backend

### Desenvolvimento
```bash
cd backend

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

### Banco de Dados (Prisma)
```bash
cd backend

# Gerar cliente Prisma
npx prisma generate

# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Abrir Prisma Studio (GUI do banco)
npx prisma studio

# Seed do banco com dados de teste
npx prisma db seed
```

### Testes
```bash
cd backend

# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Teste específico
npm test -- auth.controller.test.ts
```

---

## 🎨 Frontend

### Desenvolvimento
```bash
cd frontend

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Testes
```bash
cd frontend

# Executar testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes E2E com Cypress
npx cypress open
```

### Linting e Formatação
```bash
cd frontend

# Verificar erros
npm run lint

# Corrigir erros automaticamente
npm run lint:fix

# Formatar código
npm run format
```

---

## 🤖 ML Service

### Desenvolvimento
```bash
cd ml-service

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
uvicorn main:app --reload

# Iniciar em porta específica
uvicorn main:app --reload --port 8001
```

### Testes
```bash
cd ml-service

# Executar testes
pytest

# Testes com cobertura
pytest --cov=.

# Testes verbosos
pytest -v

# Teste específico
pytest test_risk_analyzer.py
```

---

## 🗄️ PostgreSQL

### Comandos Locais
```bash
# Conectar ao banco
psql -U postgres -d cryptoaml

# Listar bancos
\l

# Conectar a um banco
\c cryptoaml

# Listar tabelas
\dt

# Descrever tabela
\d User

# Executar query
SELECT * FROM "User";

# Sair
\q
```

### Backup e Restore
```bash
# Backup
pg_dump -U postgres cryptoaml > backup.sql

# Restore
psql -U postgres cryptoaml < backup.sql
```

---

## 🐳 Docker

### Comandos Gerais
```bash
# Listar containers rodando
docker ps

# Listar todos os containers
docker ps -a

# Ver logs de um container
docker logs cryptoaml-backend

# Entrar em um container
docker exec -it cryptoaml-backend sh

# Parar um container
docker stop cryptoaml-backend

# Remover um container
docker rm cryptoaml-backend

# Remover imagem
docker rmi cryptoaml-backend
```

### Docker Compose
```bash
# Iniciar serviços específicos
docker-compose up backend frontend

# Reconstruir um serviço
docker-compose up -d --build backend

# Ver logs de um serviço
docker-compose logs -f backend

# Executar comando em um serviço
docker-compose exec backend npm run migrate

# Parar e remover tudo
docker-compose down -v
```

---

## 🔍 Debug

### Backend Debug
```bash
cd backend

# Debug com Node Inspector
node --inspect-brk src/server.ts

# Debug com VS Code
# Adicione ao launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/server.ts",
  "preLaunchTask": "tsc: build - tsconfig.json",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
}
```

### Frontend Debug
```bash
# Chrome DevTools
# Abra http://localhost:3000
# F12 para abrir DevTools

# React DevTools
# Instale a extensão do Chrome
# https://chrome.google.com/webstore/detail/react-developer-tools
```

---

## 📊 Monitoramento

### Logs
```bash
# Backend logs
cd backend
npm run dev | tee logs/backend.log

# Frontend logs
cd frontend
npm run dev | tee logs/frontend.log

# ML Service logs
cd ml-service
uvicorn main:app --reload | tee logs/ml.log
```

### Performance
```bash
# Analisar bundle do frontend
cd frontend
npm run build -- --analyze

# Profile do Node.js
cd backend
node --prof src/server.ts
```

---

## 🧹 Limpeza

### Limpar Dependências
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# ML Service
cd ml-service
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

### Limpar Build
```bash
# Backend
cd backend
rm -rf dist

# Frontend
cd frontend
rm -rf dist
```

### Limpar Docker
```bash
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune

# Remover volumes não usados
docker volume prune

# Limpar tudo (CUIDADO!)
docker system prune -a
```

---

## 🚀 Deploy

### Build para Produção
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# Docker images
docker-compose build
```

### Deploy AWS (Exemplo)
```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag e push da imagem
docker tag cryptoaml-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cryptoaml-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cryptoaml-backend:latest

# Deploy no ECS
aws ecs update-service --cluster cryptoaml --service backend --force-new-deployment
```

---

## 🔐 Segurança

### Gerar JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### Verificar Vulnerabilidades
```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix

# ML Service
cd ml-service
pip check
safety check
```

---

## 📈 Performance Testing

### Load Testing
```bash
# Instalar Artillery
npm install -g artillery

# Executar teste
artillery run artillery.yml

# Quick test
artillery quick --count 10 --num 100 http://localhost:3001/api/health
```

### Benchmark
```bash
# Backend
cd backend
npm run benchmark

# ML Service
cd ml-service
python -m pytest --benchmark-only
```

---

## 🔄 Git

### Workflow Comum
```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade

# Merge para main
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

### Conventional Commits
```bash
# Features
git commit -m "feat: adiciona análise de Solana"

# Fixes
git commit -m "fix: corrige cálculo de risk score"

# Docs
git commit -m "docs: atualiza README"

# Style
git commit -m "style: formata código"

# Refactor
git commit -m "refactor: melhora estrutura de pastas"

# Test
git commit -m "test: adiciona testes de integração"

# Chore
git commit -m "chore: atualiza dependências"
```

---

## 📚 Documentação

### Gerar Documentação da API
```bash
# Swagger/OpenAPI
cd backend
npm run docs:generate

# Acesse: http://localhost:3001/api-docs
```

### Gerar Documentação do Código
```bash
# TypeDoc para TypeScript
cd backend
npx typedoc --out docs src

# JSDoc para JavaScript
npx jsdoc -c jsdoc.json
```

---

## 🎯 Atalhos Úteis

### Raiz do Projeto
```bash
# Instalar tudo
npm run install:all

# Iniciar backend
npm run dev:backend

# Iniciar frontend
npm run dev:frontend

# Iniciar ML service
npm run dev:ml

# Docker up
npm run docker:up

# Docker down
npm run docker:down

# Migrar banco
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio
```

---

## 🆘 Troubleshooting

### Porta em Uso
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Permissões (Linux/Mac)
```bash
# Dar permissão de execução
chmod +x script.sh

# Mudar dono
sudo chown -R $USER:$USER .
```

### Cache do NPM
```bash
# Limpar cache
npm cache clean --force

# Verificar cache
npm cache verify
```

---

## 📝 Notas

- Sempre execute `npm install` após fazer `git pull`
- Use `npm run dev` para desenvolvimento, nunca `npm start`
- Faça backup do banco antes de rodar `prisma migrate reset`
- Teste localmente antes de fazer deploy
- Mantenha as dependências atualizadas

---

## 🎉 Comandos Rápidos do Dia a Dia

```bash
# Iniciar desenvolvimento completo
docker-compose up -d

# Ver se está tudo funcionando
curl http://localhost:3001/health
curl http://localhost:8000/health

# Abrir frontend
open http://localhost:3000

# Ver logs em tempo real
docker-compose logs -f

# Parar tudo
docker-compose down
```

---

**Dica:** Adicione estes comandos aos seus aliases do shell para agilizar o desenvolvimento!

```bash
# Adicione ao ~/.bashrc ou ~/.zshrc
alias aml-start="cd ~/aml-crypto-mvp-complete && docker-compose up -d"
alias aml-stop="cd ~/aml-crypto-mvp-complete && docker-compose down"
alias aml-logs="cd ~/aml-crypto-mvp-complete && docker-compose logs -f"
alias aml-db="cd ~/aml-crypto-mvp-complete/backend && npx prisma studio"
```
