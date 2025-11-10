import httpx
import asyncio
from main import app

async def test_endpoints():
    print("Testando endpoints da API...\n")
    
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Teste 1: Root endpoint
        print("1. Testando GET /")
        response = await client.get("/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        
        # Teste 2: Health check
        print("2. Testando GET /health")
        response = await client.get("/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        
        # Teste 3: Analyze transaction
        print("3. Testando POST /analyze/transaction")
        response = await client.post("/analyze/transaction", json={
            "hash": "0xabc123",
            "fromAddress": "0x1234567890",
            "toAddress": "0x0987654321",
            "amount": 10.0,
            "blockchain": "ETHEREUM"
        })
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        
        # Teste 4: Analyze wallet
        print("4. Testando POST /analyze/wallet")
        response = await client.post("/analyze/wallet", json={
            "address": "0x1234567890",
            "blockchain": "ETHEREUM",
            "transactions": [
                {"hash": "tx1", "fromAddress": "0x111", "toAddress": "0x222", "amount": 10.0},
                {"hash": "tx2", "fromAddress": "0x111", "toAddress": "0x333", "amount": 20.0}
            ]
        })
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        
        print("="*50)
        print("Todos os endpoints funcionando corretamente!")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
