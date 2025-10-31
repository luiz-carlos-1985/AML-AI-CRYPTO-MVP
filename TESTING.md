# 🧪 Guia de Testes - CryptoAML

## 📋 Estratégia de Testes

### Pirâmide de Testes

```
        ┌─────────────┐
        │   E2E (5%)  │  ← Testes de ponta a ponta
        ├─────────────┤
        │ Integration │  ← Testes de integração (15%)
        │    (15%)    │
        ├─────────────┤
        │    Unit     │  ← Testes unitários (80%)
        │    (80%)    │
        └─────────────┘
```

---

## 🎯 Testes Unitários

### Backend (Jest + TypeScript)

**Instalação:**
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Configuração (jest.config.js):**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

**Exemplo: Teste de Controller**
```typescript
// src/controllers/__tests__/auth.controller.test.ts
import { register, login } from '../auth.controller';
import prisma from '../../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../utils/prisma');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        plan: 'STARTER'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('token123');

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'token123',
        user: expect.objectContaining({
          email: 'test@example.com'
        })
      });
    });

    it('should return error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '123' });

      const req = {
        body: { email: 'existing@example.com' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email already registered'
      });
    });
  });
});
```

**Exemplo: Teste de Service**
```typescript
// src/services/__tests__/riskAnalysis.service.test.ts
import { analyzeWalletRisk } from '../riskAnalysis.service';
import axios from 'axios';
import prisma from '../../utils/prisma';

jest.mock('axios');
jest.mock('../../utils/prisma');

describe('Risk Analysis Service', () => {
  it('should analyze wallet and update risk score', async () => {
    const mockWallet = {
      id: 'wallet123',
      address: '0x123',
      blockchain: 'ETHEREUM',
      userId: 'user123',
      transactions: []
    };

    const mockAnalysis = {
      data: {
        riskScore: 75,
        riskLevel: 'HIGH',
        flags: ['LARGE_AMOUNT']
      }
    };

    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (axios.post as jest.Mock).mockResolvedValue(mockAnalysis);
    (prisma.wallet.update as jest.Mock).mockResolvedValue({});
    (prisma.alert.create as jest.Mock).mockResolvedValue({});

    await analyzeWalletRisk('wallet123');

    expect(prisma.wallet.update).toHaveBeenCalledWith({
      where: { id: 'wallet123' },
      data: { riskScore: 75, riskLevel: 'HIGH' }
    });

    expect(prisma.alert.create).toHaveBeenCalled();
  });
});
```

---

### Frontend (Jest + React Testing Library)

**Instalação:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Exemplo: Teste de Componente**
```typescript
// src/components/__tests__/Layout.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import { AuthProvider } from '../../hooks/useAuth';

const MockLayout = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </BrowserRouter>
);

describe('Layout Component', () => {
  it('should render navigation menu', () => {
    render(<MockLayout />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Wallets')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('should display user information', () => {
    render(<MockLayout />);
    
    // Assumindo que o usuário está logado
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });
});
```

**Exemplo: Teste de Hook**
```typescript
// src/hooks/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import api from '../../services/api';

jest.mock('../../services/api');

describe('useAuth Hook', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        token: 'token123',
        user: { id: '1', email: 'test@example.com', name: 'Test' }
      }
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: any) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });
});
```

---

### ML Service (Pytest)

**Instalação:**
```bash
cd ml-service
pip install pytest pytest-asyncio httpx
```

**Exemplo: Teste de Análise**
```python
# test_risk_analyzer.py
import pytest
from risk_analyzer import RiskAnalyzer

@pytest.fixture
def analyzer():
    return RiskAnalyzer()

def test_analyze_wallet_low_risk(analyzer):
    result = analyzer.analyze_wallet(
        address="0x123",
        blockchain="ETHEREUM",
        transactions=[]
    )
    
    assert result['riskLevel'] == 'LOW'
    assert result['riskScore'] < 30
    assert len(result['flags']) == 0

def test_analyze_wallet_mixer_detected(analyzer):
    result = analyzer.analyze_wallet(
        address="0x1mixer123",
        blockchain="ETHEREUM",
        transactions=[]
    )
    
    assert result['riskLevel'] in ['HIGH', 'CRITICAL']
    assert 'MIXER_ADDRESS' in result['flags']
    assert result['riskScore'] >= 40

def test_analyze_transaction_large_amount(analyzer):
    result = analyzer.analyze_transaction(
        tx_hash="0xabc123",
        from_address="0x123",
        to_address="0x456",
        amount=150.0,
        blockchain="ETHEREUM"
    )
    
    assert 'VERY_LARGE_AMOUNT' in result['flags']
    assert result['riskScore'] > 30
```

**Exemplo: Teste de API**
```python
# test_main.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_transaction():
    payload = {
        "hash": "0xabc123",
        "fromAddress": "0x123",
        "toAddress": "0x456",
        "amount": 10.5,
        "blockchain": "ETHEREUM"
    }
    
    response = client.post("/analyze/transaction", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "riskScore" in data
    assert "riskLevel" in data
    assert "flags" in data
    assert "explanation" in data
```

---

## 🔗 Testes de Integração

### Backend Integration Tests

```typescript
// src/__tests__/integration/wallet.integration.test.ts
import request from 'supertest';
import app from '../../server';
import prisma from '../../utils/prisma';

describe('Wallet Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Criar usuário de teste
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'integration@test.com',
        password: 'password123',
        name: 'Integration Test'
      });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('should create, list, and delete wallet', async () => {
    // Create
    const createResponse = await request(app)
      .post('/api/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        address: '0xTestWallet123',
        blockchain: 'ETHEREUM',
        label: 'Test Wallet'
      });

    expect(createResponse.status).toBe(201);
    const walletId = createResponse.body.id;

    // List
    const listResponse = await request(app)
      .get('/api/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.length).toBeGreaterThan(0);

    // Delete
    const deleteResponse = await request(app)
      .delete(`/api/wallets/${walletId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(deleteResponse.status).toBe(200);
  });
});
```

---

## 🌐 Testes E2E (End-to-End)

### Cypress

**Instalação:**
```bash
cd frontend
npm install --save-dev cypress
```

**Exemplo: Teste de Fluxo Completo**
```typescript
// cypress/e2e/wallet-flow.cy.ts
describe('Wallet Management Flow', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('should add, view, and delete wallet', () => {
    // Navigate to wallets
    cy.contains('Wallets').click();
    cy.url().should('include', '/wallets');

    // Add wallet
    cy.contains('Add Wallet').click();
    cy.get('input[name="address"]').type('0xTestWallet123');
    cy.get('select[name="blockchain"]').select('ETHEREUM');
    cy.get('input[name="label"]').type('E2E Test Wallet');
    cy.contains('button', 'Add Wallet').click();

    // Verify wallet appears
    cy.contains('E2E Test Wallet').should('be.visible');

    // Delete wallet
    cy.contains('E2E Test Wallet')
      .parent()
      .find('button[title="Delete"]')
      .click();
    cy.on('window:confirm', () => true);

    // Verify wallet is gone
    cy.contains('E2E Test Wallet').should('not.exist');
  });
});
```

---

## 📊 Cobertura de Testes

### Configurar Cobertura

**Backend:**
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

**Executar:**
```bash
npm run test:coverage
```

**Meta de Cobertura:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## 🚀 CI/CD com Testes

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run tests
        run: cd frontend && npm test

  ml-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: cd ml-service && pip install -r requirements.txt
      - name: Run tests
        run: cd ml-service && pytest
```

---

## 🔍 Testes de Performance

### Load Testing com Artillery

**Instalação:**
```bash
npm install -g artillery
```

**Configuração (artillery.yml):**
```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
  
scenarios:
  - name: "API Load Test"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/wallets"
          headers:
            Authorization: "Bearer {{ token }}"
```

**Executar:**
```bash
artillery run artillery.yml
```

---

## ✅ Checklist de Testes

### Antes de Cada Release

- [ ] Todos os testes unitários passando
- [ ] Cobertura de código > 80%
- [ ] Testes de integração passando
- [ ] Testes E2E críticos passando
- [ ] Testes de performance executados
- [ ] Testes de segurança (OWASP)
- [ ] Testes de acessibilidade
- [ ] Testes em múltiplos navegadores
- [ ] Testes mobile responsivo

---

## 📚 Boas Práticas

### 1. Nomenclatura
```typescript
// ✅ Bom
describe('UserService', () => {
  it('should create user with valid data', () => {});
  it('should throw error when email is invalid', () => {});
});

// ❌ Ruim
describe('test', () => {
  it('works', () => {});
});
```

### 2. Arrange-Act-Assert
```typescript
it('should calculate risk score correctly', () => {
  // Arrange
  const wallet = { address: '0x123', transactions: [] };
  
  // Act
  const result = analyzeWallet(wallet);
  
  // Assert
  expect(result.riskScore).toBeLessThan(30);
});
```

### 3. Mocks e Stubs
```typescript
// Mock apenas o necessário
jest.mock('../../services/external-api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'mock' })
}));
```

### 4. Testes Independentes
```typescript
// Cada teste deve ser independente
beforeEach(() => {
  // Reset state
  jest.clearAllMocks();
});
```

---

## 🐛 Debug de Testes

### Jest Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Cypress Debug
```typescript
cy.debug(); // Pausa execução
cy.pause(); // Pausa com controles
```

---

## 📖 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Docs](https://docs.cypress.io/)
- [Pytest Guide](https://docs.pytest.org/)
