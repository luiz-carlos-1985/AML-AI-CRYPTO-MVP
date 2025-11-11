# 🏗️ Arquitetura - CryptoAML

## 📐 Visão Geral

CryptoAML utiliza uma arquitetura moderna de microserviços com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              React + TypeScript + Tailwind                   │
│                    (Port 3000)                               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│           Node.js + Express + TypeScript                     │
│                    (Port 3001)                               │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Auth    │ Wallets  │  Trans.  │  Alerts  │ Reports  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ Prisma ORM                 │ HTTP
             ▼                            ▼
┌─────────────────────┐      ┌──────────────────────────────┐
│    PostgreSQL       │      │       ML SERVICE             │
│   (Port 5432)       │      │  Python + FastAPI + ML       │
│                     │      │      (Port 8000)             │
│  ┌──────────────┐   │      │  ┌────────────────────────┐ │
│  │ Users        │   │      │  │  Risk Analyzer         │ │
│  │ Wallets      │   │      │  │  Pattern Detection     │ │
│  │ Transactions │   │      │  │  Heuristics Engine     │ │
│  │ Alerts       │   │      │  └────────────────────────┘ │
│  │ Reports      │   │      └──────────────────────────────┘
│  └──────────────┘   │
└─────────────────────┘
             │
             │ (Optional)
             ▼
┌─────────────────────┐
│       Redis         │
│   (Port 6379)       │
│   Queue & Cache     │
└─────────────────────┘
```

---

## 🎯 Componentes Principais

### 1. Frontend (React SPA)

**Tecnologias:**
- React 18 com TypeScript
- Tailwind CSS para estilização
- Recharts para visualizações
- React Router para navegação
- Axios para HTTP
- Context API para estado global

**Estrutura:**
```
frontend/src/
├── components/      # Componentes reutilizáveis
│   └── Layout.tsx   # Layout principal com navegação
├── pages/           # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Wallets.tsx
│   ├── Transactions.tsx
│   ├── Alerts.tsx
│   └── Reports.tsx
├── hooks/           # Custom hooks
│   └── useAuth.tsx  # Autenticação
├── services/        # Serviços de API
│   └── api.ts       # Cliente Axios configurado
└── App.tsx          # Componente raiz
```

**Fluxo de Dados:**
1. Usuário interage com UI
2. Componente chama serviço de API
3. API retorna dados
4. Estado é atualizado
5. UI re-renderiza

---

### 2. Backend API (Node.js)

**Tecnologias:**
- Node.js 20 + Express
- TypeScript para type safety
- Prisma ORM para banco de dados
- JWT para autenticação
- Bull para filas (opcional)

**Arquitetura em Camadas:**

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← Define endpoints
│  (auth, wallets, transactions...)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controllers Layer              │  ← Lógica de requisição
│  (validação, resposta HTTP)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │  ← Lógica de negócio
│  (análise de risco, relatórios)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Access Layer              │  ← Acesso ao banco
│         (Prisma ORM)                │
└─────────────────────────────────────┘
```

**Principais Módulos:**

#### Auth Module
- Registro de usuários
- Login com JWT
- Middleware de autenticação
- Gestão de perfil

#### Wallet Module
- CRUD de carteiras
- Análise de risco automática
- Monitoramento ativo/inativo

#### Transaction Module
- Listagem com filtros
- Detalhes de transação
- Análise de padrões

#### Alert Module
- Criação automática de alertas
- Gestão de status (lido/resolvido)
- Filtros por severidade

#### Report Module
- Geração assíncrona
- Múltiplos formatos (PDF/CSV)
- Download de arquivos

---

### 3. ML Service (Python)

**Tecnologias:**
- Python 3.11
- FastAPI para API REST
- Scikit-learn para ML
- NumPy/Pandas para análise

**Componentes:**

#### Risk Analyzer
```python
class RiskAnalyzer:
    def analyze_wallet(address, blockchain, transactions):
        # 1. Verificar mixers conhecidos
        # 2. Analisar padrões de transações
        # 3. Calcular volume total
        # 4. Verificar frequência
        # 5. Retornar score + flags
        
    def analyze_transaction(hash, from, to, amount):
        # 1. Verificar endereços suspeitos
        # 2. Analisar valor
        # 3. Detectar padrões
        # 4. Retornar risco + explicação
```

**Heurísticas Implementadas:**
- Detecção de mixers/tumblers
- Análise de volume anormal
- Identificação de estruturação
- Movimentação rápida (churning)
- Padrões de valores similares

---

### 4. Banco de Dados (PostgreSQL)

**Schema Principal:**

```sql
-- Usuários e autenticação
User (id, email, password, name, company, plan)

-- Carteiras monitoradas
Wallet (id, address, blockchain, userId, riskScore, riskLevel)

-- Transações analisadas
Transaction (id, hash, walletId, fromAddress, toAddress, 
             amount, riskScore, riskLevel, flags)

-- Alertas gerados
Alert (id, userId, walletId, transactionId, type, 
       severity, title, description, isRead, isResolved)

-- Relatórios
Report (id, userId, type, format, startDate, endDate, 
        fileUrl, status)

-- API Keys
ApiKey (id, userId, key, name, isActive)
```

**Relacionamentos:**
- User → Wallets (1:N)
- User → Alerts (1:N)
- User → Reports (1:N)
- Wallet → Transactions (1:N)
- Wallet → Alerts (1:N)
- Transaction → Alerts (1:N)

**Índices:**
- `User.email` (unique)
- `Wallet.address` (unique)
- `Transaction.hash` (unique)
- `Wallet.userId` (foreign key)
- `Transaction.walletId` (foreign key)

---

## 🔄 Fluxos de Dados

### Fluxo 1: Adicionar Carteira

```
1. Frontend → POST /api/wallets
2. Backend valida dados
3. Backend cria registro no DB
4. Backend dispara análise assíncrona
5. ML Service analisa carteira
6. Backend atualiza riskScore
7. Se risco alto → cria Alert
8. Frontend recebe confirmação
```

### Fluxo 2: Análise de Transação

```
1. Sistema detecta nova transação
2. Backend → POST /ml-service/analyze/transaction
3. ML Service:
   - Verifica endereços
   - Analisa valor
   - Detecta padrões
   - Calcula score
4. ML Service retorna resultado
5. Backend salva no DB
6. Se risco alto → cria Alert
7. Frontend exibe em tempo real
```

### Fluxo 3: Geração de Relatório

```
1. Frontend → POST /api/reports/generate
2. Backend cria registro (status: PROCESSING)
3. Backend inicia job assíncrono
4. Job busca dados do período
5. Job gera PDF/CSV
6. Job salva arquivo
7. Backend atualiza status (COMPLETED)
8. Frontend permite download
```

---

## 🔐 Segurança

### Autenticação
- JWT com expiração configurável
- Tokens armazenados no localStorage
- Refresh automático (futuro)

### Autorização
- Middleware verifica token em todas as rotas protegidas
- Multi-tenancy: usuários só acessam seus dados
- Validação de ownership em todas as operações

### Proteções
- Rate limiting (100 req/15min)
- Helmet.js para headers de segurança
- CORS configurado
- Validação de inputs com Joi
- SQL injection prevenido (Prisma ORM)
- XSS prevenido (React escapa automaticamente)

---

## 📊 Performance

### Otimizações Implementadas

#### Backend
- Índices no banco de dados
- Queries otimizadas com Prisma
- Paginação em listagens
- Cache de resultados (futuro com Redis)

#### Frontend
- Code splitting com React.lazy
- Memoização de componentes
- Debounce em buscas
- Lazy loading de imagens

#### ML Service
- Análise assíncrona
- Batch processing (futuro)
- Cache de resultados conhecidos

---

## 🚀 Escalabilidade

### Horizontal Scaling

**Backend:**
- Stateless (pode rodar múltiplas instâncias)
- Load balancer distribui requisições
- Sessões em JWT (não precisa de session store)

**ML Service:**
- Múltiplas instâncias para análise paralela
- Queue system para distribuir trabalho

**Database:**
- Read replicas para queries
- Connection pooling
- Particionamento de tabelas grandes

### Vertical Scaling

**Quando necessário:**
- Aumentar recursos do servidor
- Otimizar queries complexas
- Adicionar índices específicos

---

## 🔧 DevOps

### Containerização
- Docker para cada serviço
- Docker Compose para desenvolvimento
- Kubernetes para produção (futuro)

### CI/CD (Futuro)
```
1. Push para GitHub
2. GitHub Actions executa:
   - Testes unitários
   - Testes de integração
   - Build de containers
3. Deploy automático para staging
4. Testes E2E
5. Deploy para produção (manual)
```

### Monitoramento (Futuro)
- Logs centralizados (ELK Stack)
- Métricas (Prometheus + Grafana)
- APM (New Relic ou DataDog)
- Alertas (PagerDuty)

---

## 🌐 Deploy em Produção

### Infraestrutura Recomendada

```
┌─────────────────────────────────────────┐
│           CloudFlare CDN                │
│         (SSL, DDoS Protection)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Load Balancer (AWS ALB)         │
└──────┬───────────────────────┬──────────┘
       │                       │
┌──────▼────────┐    ┌────────▼─────────┐
│  Frontend     │    │   Backend API    │
│  (S3 + CF)    │    │   (ECS/Fargate)  │
└───────────────┘    └────────┬─────────┘
                              │
                    ┌─────────▼──────────┐
                    │   ML Service       │
                    │   (ECS/Fargate)    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   PostgreSQL       │
                    │   (RDS)            │
                    └────────────────────┘
```

### Custos Estimados (AWS)

**Starter (até 100 clientes):**
- EC2 t3.small (Backend): $15/mês
- EC2 t3.micro (ML): $8/mês
- RDS db.t3.micro: $15/mês
- S3 + CloudFront: $5/mês
- **Total:** ~$50/mês

**Growth (até 1000 clientes):**
- ECS Fargate (Backend): $50/mês
- ECS Fargate (ML): $30/mês
- RDS db.t3.small: $30/mês
- S3 + CloudFront: $20/mês
- **Total:** ~$150/mês

---

## 📚 Tecnologias e Versões

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Frontend | React | 18.2+ |
| Frontend | TypeScript | 5.3+ |
| Frontend | Tailwind CSS | 3.4+ |
| Backend | Node.js | 20+ |
| Backend | Express | 4.18+ |
| Backend | Prisma | 5.8+ |
| Database | PostgreSQL | 15+ |
| ML Service | Python | 3.11+ |
| ML Service | FastAPI | 0.109+ |
| ML Service | Scikit-learn | 1.4+ |
| Container | Docker | 24+ |

---

## 🔄 Próximas Evoluções

### ✅ Fase 2 - IMPLEMENTADO
- ✅ **Advanced Security** - Sistema de auditoria 24/7 com certificações internacionais
- ✅ **Internationalization** - 11 idiomas com detecção automática
- ✅ **Threat Detection** - IA para análise comportamental
- ✅ **Compliance Automation** - Relatórios regulatórios automáticos
- ✅ **Anti-Copy Protection** - Fingerprinting + blockchain intelligence

### ⏳ Fase 3 - EM DESENVOLVIMENTO
- ⏳ **WebSocket Real-time** - Notificações instantâneas
- ⏳ **Redis Cache & Queues** - Performance otimizada
- ⏳ **Elasticsearch** - Busca avançada cross-chain
- ⏳ **Quantum Encryption** - Criptografia pós-quântica

### 🚀 Fase 4 - PLANEJADO
- 🚀 **Kubernetes** - Orquestração de containers
- 🚀 **GraphQL** - API alternativa ao REST
- 🚀 **Event-driven Architecture** - Arquitetura baseada em eventos
- 🚀 **CQRS Pattern** - Escalabilidade avançada
- 🚀 **Blockchain Native** - Blockchain própria para compliance

---

## 📖 Referências

- [Prisma Docs](https://www.prisma.io/docs)
- [React Best Practices](https://react.dev)
- [FastAPI Guide](https://fastapi.tiangolo.com)
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected)
