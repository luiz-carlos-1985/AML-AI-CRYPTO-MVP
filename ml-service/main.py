from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from datetime import datetime
from risk_analyzer import RiskAnalyzer

app = FastAPI(title="CryptoAML ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = RiskAnalyzer()

class Transaction(BaseModel):
    hash: str
    fromAddress: str
    toAddress: str
    amount: float
    timestamp: Optional[datetime] = None

class WalletAnalysisRequest(BaseModel):
    address: str
    blockchain: str
    transactions: List[Transaction] = []

class TransactionAnalysisRequest(BaseModel):
    hash: str
    fromAddress: str
    toAddress: str
    amount: float
    blockchain: str

class AnalysisResponse(BaseModel):
    riskScore: float
    riskLevel: str
    flags: List[str]
    explanation: str

@app.get("/")
def read_root():
    return {"service": "CryptoAML ML Service", "status": "running"}

@app.post("/analyze/wallet", response_model=AnalysisResponse)
async def analyze_wallet(request: WalletAnalysisRequest):
    try:
        result = analyzer.analyze_wallet(
            address=request.address,
            blockchain=request.blockchain,
            transactions=[t.dict() for t in request.transactions]
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/transaction", response_model=AnalysisResponse)
async def analyze_transaction(request: TransactionAnalysisRequest):
    try:
        result = analyzer.analyze_transaction(
            tx_hash=request.hash,
            from_address=request.fromAddress,
            to_address=request.toAddress,
            amount=request.amount,
            blockchain=request.blockchain
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    try:
        # Test analyzer is working
        test_result = analyzer.analyze_transaction(
            tx_hash="test",
            from_address="0x0000000000000000000000000000000000000000",
            to_address="0x0000000000000000000000000000000000000001",
            amount=1.0,
            blockchain="ETHEREUM"
        )
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "analyzer": "operational",
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
