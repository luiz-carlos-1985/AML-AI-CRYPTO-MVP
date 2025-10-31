# 📚 API Documentation - CryptoAML

## Base URL
```
http://localhost:3001/api
```

## Authentication

Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "plan": "STARTER"
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile
```http
GET /auth/profile
```

---

## 💼 Wallet Endpoints

### Create Wallet
```http
POST /wallets
```

**Body:**
```json
{
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "blockchain": "BITCOIN",
  "label": "My Bitcoin Wallet"
}
```

### List Wallets
```http
GET /wallets
```

**Response:**
```json
[
  {
    "id": "uuid",
    "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "blockchain": "BITCOIN",
    "label": "My Bitcoin Wallet",
    "riskScore": 25.5,
    "riskLevel": "LOW",
    "isMonitored": true,
    "_count": {
      "transactions": 10,
      "alerts": 2
    }
  }
]
```

### Get Wallet Details
```http
GET /wallets/:id
```

### Update Wallet
```http
PUT /wallets/:id
```

**Body:**
```json
{
  "label": "Updated Label",
  "isMonitored": false
}
```

### Delete Wallet
```http
DELETE /wallets/:id
```

---

## 💸 Transaction Endpoints

### List Transactions
```http
GET /transactions?walletId=uuid&riskLevel=HIGH&limit=50
```

**Query Parameters:**
- `walletId` (optional): Filter by wallet
- `riskLevel` (optional): LOW, MEDIUM, HIGH, CRITICAL
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
[
  {
    "id": "uuid",
    "hash": "abc123...",
    "fromAddress": "0x123...",
    "toAddress": "0x456...",
    "amount": 1.5,
    "riskScore": 75.0,
    "riskLevel": "HIGH",
    "flags": ["LARGE_AMOUNT", "MIXER_DETECTED"],
    "timestamp": "2024-01-15T10:30:00Z",
    "wallet": {
      "address": "0x123...",
      "blockchain": "ETHEREUM"
    }
  }
]
```

### Get Transaction Details
```http
GET /transactions/:id
```

---

## 🚨 Alert Endpoints

### List Alerts
```http
GET /alerts?isRead=false&severity=HIGH
```

**Query Parameters:**
- `isRead` (optional): true/false
- `isResolved` (optional): true/false
- `severity` (optional): LOW, MEDIUM, HIGH, CRITICAL

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "HIGH_RISK_TRANSACTION",
    "severity": "HIGH",
    "title": "Suspicious Transaction Detected",
    "description": "Transaction flagged with risk score 85...",
    "isRead": false,
    "isResolved": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "wallet": {
      "address": "0x123...",
      "blockchain": "ETHEREUM"
    }
  }
]
```

### Mark Alert as Read
```http
PATCH /alerts/:id/read
```

### Mark Alert as Resolved
```http
PATCH /alerts/:id/resolve
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Stats
```http
GET /dashboard/stats
```

**Response:**
```json
{
  "totalWallets": 5,
  "totalTransactions": 150,
  "totalAlerts": 12,
  "unreadAlerts": 3,
  "highRiskTransactions": 8,
  "riskDistribution": {
    "LOW": 100,
    "MEDIUM": 30,
    "HIGH": 15,
    "CRITICAL": 5
  },
  "recentTransactions": [...]
}
```

---

## 📄 Report Endpoints

### Generate Report
```http
POST /reports/generate
```

**Body:**
```json
{
  "type": "CUSTOM",
  "format": "PDF",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response:**
```json
{
  "id": "uuid",
  "type": "CUSTOM",
  "format": "PDF",
  "status": "PROCESSING",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### List Reports
```http
GET /reports
```

---

## 🤖 ML Service Endpoints

### Analyze Wallet
```http
POST http://localhost:8000/analyze/wallet
```

**Body:**
```json
{
  "address": "0x123...",
  "blockchain": "ETHEREUM",
  "transactions": [
    {
      "hash": "0xabc...",
      "fromAddress": "0x123...",
      "toAddress": "0x456...",
      "amount": 1.5,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "riskScore": 65.5,
  "riskLevel": "MEDIUM",
  "flags": ["HIGH_VOLUME", "RAPID_MOVEMENT"],
  "explanation": "Risk level: MEDIUM. Detected issues: High cumulative transaction volume; Rapid movement of funds detected."
}
```

### Analyze Transaction
```http
POST http://localhost:8000/analyze/transaction
```

**Body:**
```json
{
  "hash": "0xabc...",
  "fromAddress": "0x123...",
  "toAddress": "0x456...",
  "amount": 10.5,
  "blockchain": "ETHEREUM"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response:** 429 Too Many Requests

---

## Webhooks (Future Feature)

Configure webhooks para receber notificações em tempo real:

```http
POST /webhooks
```

**Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["alert.created", "transaction.high_risk"]
}
```
