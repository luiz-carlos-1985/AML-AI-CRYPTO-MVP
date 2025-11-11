# ML Service Setup Guide

## Overview
The ML service provides advanced risk analysis using machine learning algorithms to complement rule-based detection.

## Requirements
- Python 3.8+
- pip (Python package manager)

## Installation

### 1. Navigate to ML Service Directory
```bash
cd ml-service
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Enable in Backend
Set in backend/.env:
```
ENABLE_ML_SERVICE=true
ML_SERVICE_URL=http://localhost:8000
```

## Features
- **Transaction Risk Analysis**: ML-based scoring (0-100)
- **Wallet Risk Assessment**: Aggregate analysis of all transactions
- **Feature Engineering**: Amount patterns, address complexity, flags
- **Risk Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Automatic Flags**: HIGH_VALUE, ROUND_AMOUNT, ML_HIGH_RISK

## API Endpoints
- `GET /health` - Service health check
- `POST /analyze/transaction` - Analyze single transaction
- `POST /analyze/wallet` - Analyze wallet with multiple transactions

## Model Training
The service automatically trains a RandomForest model on first run if no model exists. The model uses synthetic data for demonstration purposes.

## Troubleshooting
- Ensure Python 3.8+ is installed
- Install dependencies: `pip install flask flask-cors numpy scikit-learn joblib`
- Check port 8000 is available
- Verify backend can reach http://localhost:8000

## Production Notes
- Replace synthetic training data with real AML datasets
- Implement proper model versioning
- Add model performance monitoring
- Consider GPU acceleration for larger models