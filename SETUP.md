# 🚀 Guia de Instalação - CryptoAML

## Pré-requisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis (opcional, para produção)
- Docker & Docker Compose (opcional)

## Opção 1: Instalação com Docker (Recomendado)

### Passo 1: Clone o repositório
```bash
git clone <seu-repositorio>
cd aml-crypto-mvp-complete
```

### Passo 2: Execute com Docker Compose
```bash
docker-compose up -d
```

### Passo 3: Acesse a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- ML Service: http://localhost:8000

## Opção 2: Instalação Manual

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrações do banco
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### ML Service

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
```

## Configuração do Banco de Dados

### PostgreSQL

1. Crie um banco de dados:
```sql
CREATE DATABASE cryptoaml;
```

2. Configure a URL no arquivo `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/cryptoaml?schema=public"
```

## Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cryptoaml"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:8000
```

## Testando a Instalação

### 1. Verificar Backend
```bash
curl http://localhost:3001/health
```

### 2. Verificar ML Service
```bash
curl http://localhost:8000/health
```

### 3. Criar usuário de teste
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "company": "Test Company"
  }'
```

## Estrutura de Diretórios

```
aml-crypto-mvp-complete/
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
├── frontend/          # React + TypeScript
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── hooks/
├── ml-service/        # Python + FastAPI
│   ├── main.py
│   └── risk_analyzer.py
└── docker-compose.yml
```

## Próximos Passos

1. **Configurar APIs de Blockchain**
   - Obtenha chaves de API para Etherscan, Blockchain.info, etc.
   - Configure no arquivo `.env`

2. **Personalizar Análise de Risco**
   - Edite `ml-service/risk_analyzer.py`
   - Adicione seus próprios padrões e heurísticas

3. **Configurar Relatórios**
   - Os relatórios são salvos em `backend/reports/`
   - Configure storage em nuvem (S3, etc.) para produção

4. **Deploy em Produção**
   - Configure HTTPS
   - Use variáveis de ambiente seguras
   - Configure backup do banco de dados
   - Implemente monitoramento e logs

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute `npx prisma migrate dev`

### Erro no ML Service
- Verifique se todas as dependências Python foram instaladas
- Confirme que a porta 8000 está disponível

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 3001
- Confirme a configuração de proxy no `vite.config.ts`

## Suporte

Para dúvidas e suporte:
- Email: suporte@cryptoaml.com
- Documentação: https://docs.cryptoaml.com
