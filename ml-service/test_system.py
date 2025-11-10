import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from risk_analyzer import RiskAnalyzer

def test_analyzer():
    analyzer = RiskAnalyzer()
    tests_passed = 0
    tests_failed = 0
    
    # Teste 1: Transação normal
    print("Teste 1: Transação normal...")
    result = analyzer.analyze_transaction(
        tx_hash="abc123def456",
        from_address="0x1234567890",
        to_address="0x0987654321",
        amount=10.0,
        blockchain="ETHEREUM"
    )
    if result['riskLevel'] == 'LOW' and result['riskScore'] < 30:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Score: {result['riskScore']}, Level: {result['riskLevel']}")
        tests_failed += 1
    
    # Teste 2: Transação com mixer
    print("\nTeste 2: Transação com mixer...")
    result = analyzer.analyze_transaction(
        tx_hash="xyz789",
        from_address="0x1mixer123",
        to_address="0x0987654321",
        amount=10.0,
        blockchain="BITCOIN"
    )
    if 'FROM_MIXER' in result['flags'] and result['riskScore'] > 30:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}, Score: {result['riskScore']}")
        tests_failed += 1
    
    # Teste 3: Transação de valor alto
    print("\nTeste 3: Transação de valor alto...")
    result = analyzer.analyze_transaction(
        tx_hash="high123",
        from_address="0x1234567890",
        to_address="0x0987654321",
        amount=150.0,
        blockchain="ETHEREUM"
    )
    if 'VERY_LARGE_AMOUNT' in result['flags']:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}")
        tests_failed += 1
    
    # Teste 4: Dust transaction
    print("\nTeste 4: Dust transaction...")
    result = analyzer.analyze_transaction(
        tx_hash="dust123",
        from_address="0x1234567890",
        to_address="0x0987654321",
        amount=0.0001,
        blockchain="BITCOIN"
    )
    if 'DUST_TRANSACTION' in result['flags']:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}")
        tests_failed += 1
    
    # Teste 5: Análise de carteira
    print("\nTeste 5: Análise de carteira...")
    transactions = [
        {'amount': 10.0, 'hash': 'tx1'},
        {'amount': 10.5, 'hash': 'tx2'},
        {'amount': 9.8, 'hash': 'tx3'},
        {'amount': 10.2, 'hash': 'tx4'},
    ]
    result = analyzer.analyze_wallet(
        address="0x1234567890",
        blockchain="ETHEREUM",
        transactions=transactions
    )
    if 'STRUCTURING_PATTERN' in result['flags']:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}")
        tests_failed += 1
    
    # Teste 6: Carteira com alto volume
    print("\nTeste 6: Carteira com alto volume...")
    transactions = [{'amount': 50.0} for _ in range(10)]
    result = analyzer.analyze_wallet(
        address="0x1234567890",
        blockchain="BITCOIN",
        transactions=transactions
    )
    if 'HIGH_VOLUME' in result['flags']:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}")
        tests_failed += 1
    
    # Teste 7: Carteira com alta frequência
    print("\nTeste 7: Carteira com alta frequência...")
    transactions = [{'amount': 1.0} for _ in range(60)]
    result = analyzer.analyze_wallet(
        address="0x1234567890",
        blockchain="ETHEREUM",
        transactions=transactions
    )
    if 'HIGH_FREQUENCY' in result['flags']:
        print("[OK] PASSOU")
        tests_passed += 1
    else:
        print(f"[ERRO] FALHOU - Flags: {result['flags']}")
        tests_failed += 1
    
    print(f"\n{'='*50}")
    print(f"RESULTADO: {tests_passed}/{tests_passed + tests_failed} testes passaram")
    print(f"{'='*50}")
    
    return tests_failed == 0

if __name__ == "__main__":
    success = test_analyzer()
    sys.exit(0 if success else 1)
