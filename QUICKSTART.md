# ⚡ Quick Start Guide - CryptoAML

## 🚀 Início Rápido (5 minutos)

### Opção 1: Docker (Mais Rápido)

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd aml-crypto-mvp-complete

# 2. Inicie todos os serviços
docker-compose up -d

# 3. Aguarde ~30 segundos e acesse
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# ML Service: http://localhost:8000
```

### Opção 2: Desenvolvimento Local

```bash
# 1. Instale as dependências
npm run install:all

# 2. Configure o banco de dados
cd backend
cp .env.example .env
# Edite .env com suas configurações
npx prisma migrate dev

# 3. Inicie os serviços (em terminais separados)
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
npm run dev:ml        # Terminal 3
```

---

## 📝 Primeiro Acesso

### 1. Criar Conta
Acesse http://localhost:3000/register

```
Nome: Seu Nome
Email: seu@email.com
Senha: senha123
Empresa: Sua Empresa (opcional)
```

### 2. Adicionar Primeira Carteira
No menu "Wallets" → "Add Wallet"

```
Endereço: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Blockchain: Bitcoin
Label: Minha Primeira Carteira
```

### 3. Ver Dashboard
O dashboard mostrará:
- Total de carteiras
- Transações monitoradas
- Alertas de risco
- Gráficos de distribuição

---

## 🧪 Testar a API

### Registrar Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copie o `token` da resposta.

### Adicionar Carteira
```bash
curl -X POST http://localhost:3001/api/wallets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "blockchain": "ETHEREUM",
    "label": "Test Wallet"
  }'
```

### Listar Carteiras
```bash
curl http://localhost:3001/api/wallets \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🎯 Casos de Uso Comuns

### Caso 1: Monitorar Carteira de Cliente
1. Adicione a carteira do cliente
2. O sistema analisa automaticamente
3. Receba alertas se houver risco alto
4. Gere relatório para compliance

### Caso 2: Análise de Transação Suspeita
1. Vá em "Transactions"
2. Filtre por "High Risk"
3. Clique na transação para ver detalhes
4. Veja os flags e explicação do risco
5. Marque como resolvido após investigação

### Caso 3: Relatório Mensal
1. Vá em "Reports"
2. Clique em "Generate Report"
3. Selecione período (ex: último mês)
4. Escolha formato (PDF ou CSV)
5. Aguarde processamento
6. Faça download

---

## 🔧 Configurações Importantes

### Backend (.env)
```env
# Banco de dados
DATABASE_URL="postgresql://user:pass@localhost:5432/cryptoaml"

# JWT
JWT_SECRET="mude-isso-em-producao"
JWT_EXPIRES_IN="7d"

# ML Service
ML_SERVICE_URL="http://localhost:8000"

# APIs de Blockchain (opcional)
ETHERSCAN_API_KEY="sua-chave-aqui"
BLOCKCHAIN_INFO_API_KEY="sua-chave-aqui"
```

### Prisma (Banco de Dados)
```bash
# Criar migração
npx prisma migrate dev --name init

# Visualizar dados
npx prisma studio

# Resetar banco (CUIDADO!)
npx prisma migrate reset
```

---

## 📊 Dados de Teste

### Criar Transações de Teste
```bash
# No backend, crie um script seed.ts
cd backend
npx prisma db seed
```

Isso criará:
- 5 carteiras de exemplo
- 50 transações simuladas
- 10 alertas de teste

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
```bash
# Verifique se o PostgreSQL está rodando
# Windows:
services.msc

# Linux/Mac:
sudo systemctl status postgresql

# Ou use Docker:
docker-compose up postgres -d
```

### Erro: "Port 3001 already in use"
```bash
# Encontre o processo
# Windows:
netstat -ano | findstr :3001

# Linux/Mac:
lsof -i :3001

# Mate o processo ou mude a porta no .env
```

### Erro: "ML Service not responding"
```bash
# Verifique se o Python está instalado
python --version

# Instale as dependências
cd ml-service
pip install -r requirements.txt

# Inicie manualmente
uvicorn main:app --reload
```

### Frontend não carrega
```bash
# Limpe o cache
cd frontend
rm -rf node_modules
npm install

# Reconstrua
npm run build
```

---

## 📚 Próximos Passos

1. **Leia a documentação completa**
   - [SETUP.md](./SETUP.md) - Instalação detalhada
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Referência da API
   - [FEATURES.md](./FEATURES.md) - Funcionalidades

2. **Explore o código**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - ML Service: `ml-service/`

3. **Customize para seu negócio**
   - Ajuste os thresholds de risco
   - Adicione suas próprias regras
   - Personalize o frontend

4. **Deploy em produção**
   - Configure HTTPS
   - Use variáveis de ambiente seguras
   - Configure backup automático
   - Implemente monitoramento

---

## 💬 Suporte

- **Email:** suporte@cryptoaml.com
- **Documentação:** https://docs.cryptoaml.com
- **GitHub Issues:** https://github.com/seu-repo/issues

---

## 🎉 Pronto!

Você agora tem um sistema completo de detecção de AML em criptomoedas rodando localmente!

**Próximos passos sugeridos:**
1. Adicione suas próprias carteiras
2. Explore o dashboard
3. Teste a geração de relatórios
4. Integre com sua aplicação via API

Boa sorte! 🚀
