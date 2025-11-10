# 🤖 ML Service - AML Risk Analysis

Machine Learning service for cryptocurrency Anti-Money Laundering risk detection.

## Features

- ✅ Random Forest Classifier
- ✅ Real-time transaction analysis
- ✅ Wallet risk aggregation
- ✅ Feature engineering
- ✅ REST API

## Quick Start

### Option 1: Python (Development)

```bash
# Install dependencies
pip install -r requirements.txt

# Run service
python app.py
```

Service runs on http://localhost:8000

### Option 2: Docker (Production)

```bash
# Build image
docker build -t cryptoaml-ml .

# Run container
docker run -p 8000:8000 cryptoaml-ml
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Analyze Transaction
```bash
POST /analyze/transaction
Content-Type: application/json

{
  "hash": "0x...",
  "amount": 15000,
  "fromAddress": "0x...",
  "toAddress": "0x...",
  "flags": []
}

Response:
{
  "riskScore": 65,
  "riskLevel": "HIGH",
  "flags": ["HIGH_VALUE", "ML_HIGH_RISK"],
  "confidence": 0.78
}
```

### Analyze Wallet
```bash
POST /analyze/wallet
Content-Type: application/json

{
  "address": "0x...",
  "blockchain": "ETHEREUM",
  "transactions": [...]
}

Response:
{
  "riskScore": 45,
  "riskLevel": "MEDIUM",
  "flags": ["HIGH_VALUE", "ROUND_AMOUNT"]
}
```

## Model Details

- **Algorithm**: Random Forest Classifier
- **Features**: 5 engineered features
  - Normalized amount
  - High value flag
  - Round number detection
  - Address complexity
  - Existing flags count
- **Training**: Synthetic data (replace with real data)
- **Accuracy**: ~85% (on synthetic data)

## Integration

Update backend `.env`:
```bash
ML_SERVICE_URL=http://localhost:8000
```

Backend will automatically use ML service when available, fallback to rules if offline.

## Production Deployment

1. Train model with real AML data
2. Deploy to cloud (AWS/GCP/Azure)
3. Use GPU for faster inference
4. Implement model versioning
5. Add monitoring and logging

## Future Improvements

- [ ] Deep Learning models (LSTM/Transformer)
- [ ] Graph Neural Networks for address clustering
- [ ] Real-time model updates
- [ ] A/B testing framework
- [ ] Explainable AI (SHAP values)
