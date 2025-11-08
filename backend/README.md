# CryptoAML Backend

Backend API for CryptoAML - Anti-Money Laundering platform for cryptocurrency monitoring.

## Features

- 🔐 JWT Authentication + 2FA
- 💰 Multi-blockchain wallet monitoring (305+ blockchains)
- 🤖 ML-powered risk analysis
- 📊 Real-time transaction monitoring
- 🚨 Automated alert system
- 📄 Report generation (PDF, CSV, JSON)
- 🔄 WebSocket real-time updates
- 🛡️ Enterprise-grade security

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- Redis (caching)
- Socket.io (WebSocket)
- Docker

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Generate Secrets
```bash
node ../generate-secrets.js
# Copy the generated secrets to .env
```

### 4. Database Setup
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```

Server runs on http://localhost:3001

## Production Deployment

### Using Docker Compose
```bash
# Generate production secrets
node ../generate-secrets.js

# Copy to .env.production
cp .env.production.example .env.production
# Edit with generated secrets

# Deploy
docker-compose -f ../docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start
npm start
```

## Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run validate:production` - Validate production config
- `npm run health:check` - Health check
- `npm run admin:set` - Set user as admin

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Wallets
- `GET /api/wallets` - List wallets
- `POST /api/wallets` - Add wallet
- `GET /api/wallets/:id` - Get wallet details
- `DELETE /api/wallets/:id` - Remove wallet

### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details

### Alerts
- `GET /api/alerts` - List alerts
- `PUT /api/alerts/:id/read` - Mark as read
- `PUT /api/alerts/:id/resolve` - Resolve alert

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Generate report
- `GET /api/reports/:id/download` - Download report

## Security

- All passwords hashed with bcrypt
- JWT tokens with expiration
- 2FA support (TOTP)
- Rate limiting
- Helmet.js security headers
- CORS protection
- Input validation
- SQL injection protection (Prisma)

## Monitoring

- Health check: `GET /health`
- Logs: `./logs/`
- Metrics: Prometheus compatible

## Environment Variables

See `.env.example` for all available options.

Critical variables:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key (min 64 chars)
- `WALLET_ENCRYPTION_KEY` - Wallet encryption (64 hex chars)
- `REDIS_HOST` - Redis host
- `ML_SERVICE_URL` - ML service endpoint

## License

Proprietary - All rights reserved
