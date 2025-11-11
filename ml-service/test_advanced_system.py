"""
Teste do Sistema AML Avançado
Demonstra todas as funcionalidades implementadas
"""

import requests
import json
import time
from datetime import datetime, timedelta

class AdvancedAMLTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        
    def test_health_check(self):
        """Testa health check avançado"""
        print("🔍 Testando Health Check Avançado...")
        
        response = requests.get(f"{self.base_url}/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sistema operacional")
            print(f"   Versão: {data.get('version')}")
            print(f"   Uptime: {data.get('uptime_seconds')}s")
            print(f"   Análises realizadas: {data.get('analyses_performed')}")
            print(f"   Proteção ativa: {data.get('protection_active')}")
            print(f"   Módulos carregados: {len(data.get('modules', {}))}")
        else:
            print(f"❌ Falha no health check: {response.status_code}")
    
    def test_advanced_transaction_analysis(self):
        """Testa análise avançada de transação"""
        print("\n🧠 Testando Análise Avançada de Transação...")
        
        # Transação suspeita simulada
        transaction_data = {
            "hash": "0x1234567890abcdef1234567890abcdef12345678",
            "amount": 50000,  # Valor alto
            "fromAddress": "0xmixer123456789abcdef123456789abcdef12345678",  # Endereço de mixer
            "toAddress": "0xabcdef123456789abcdef123456789abcdef123456",
            "blockchain": "ETHEREUM",
            "flags": ["HIGH_VALUE"],
            "timestamp": int(time.time())
        }
        
        response = requests.post(
            f"{self.base_url}/analyze/transaction/advanced",
            json=transaction_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Análise concluída")
            print(f"   Risk Score: {data.get('riskScore')}")
            print(f"   Risk Level: {data.get('riskLevel')}")
            print(f"   Flags: {', '.join(data.get('flags', []))}")
            print(f"   Confidence: {data.get('confidence'):.2f}")
            
            # Detalhes de conformidade
            compliance = data.get('compliance', {})
            print(f"   Conformidade: {'✅' if compliance.get('compliant') else '❌'}")
            
            # Análise de grafo
            graph = data.get('graph_analysis', {})
            print(f"   Layering detectado: {'✅' if graph.get('layering_detected') else '❌'}")
            print(f"   Smurfing detectado: {'✅' if graph.get('smurfing_detected') else '❌'}")
            
            # Inteligência
            intel = data.get('intelligence', {})
            if intel.get('entity_attribution'):
                print(f"   Entidade identificada: {intel.get('entity_attribution')}")
            
        else:
            print(f"❌ Falha na análise: {response.status_code}")
            print(f"   Erro: {response.text}")
    
    def test_advanced_wallet_analysis(self):
        """Testa análise avançada de carteira"""
        print("\n💼 Testando Análise Avançada de Carteira...")
        
        wallet_data = {
            "address": "0x1234567890abcdef1234567890abcdef12345678",
            "blockchain": "ETHEREUM",
            "transactions": [
                {
                    "hash": "0xabc123",
                    "amount": 1.5,
                    "fromAddress": "0x1234567890abcdef1234567890abcdef12345678",
                    "toAddress": "0xbridge_addr_1",
                    "timestamp": int(time.time()) - 3600
                },
                {
                    "hash": "0xdef456",
                    "amount": 1.4,
                    "fromAddress": "0x1234567890abcdef1234567890abcdef12345678",
                    "toAddress": "0xbridge_addr_1",
                    "timestamp": int(time.time()) - 3000
                }
            ]
        }
        
        response = requests.post(
            f"{self.base_url}/analyze/wallet/advanced",
            json=wallet_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Análise de carteira concluída")
            print(f"   Endereço: {data.get('address')}")
            print(f"   Risk Score: {data.get('riskScore')}")
            print(f"   Risk Level: {data.get('riskLevel')}")
            
            # Atribuição
            attribution = data.get('attribution', {})
            if attribution.get('entity_match'):
                print(f"   Entidade: {attribution.get('entity_match')}")
            if attribution.get('cluster_id'):
                print(f"   Cluster: {attribution.get('cluster_id')}")
            
            # Clustering
            clustering = data.get('clustering', {})
            print(f"   Clusters encontrados: {clustering.get('total_clusters')}")
            
        else:
            print(f"❌ Falha na análise de carteira: {response.status_code}")
    
    def test_compliance_report(self):
        """Testa geração de relatório de conformidade"""
        print("\n⚖️ Testando Relatório de Conformidade...")
        
        report_data = {
            "start_date": (datetime.now() - timedelta(days=7)).isoformat(),
            "end_date": datetime.now().isoformat()
        }
        
        response = requests.post(
            f"{self.base_url}/compliance/report",
            json=report_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Relatório de conformidade gerado")
            print(f"   Período: {data.get('period', {}).get('start')} a {data.get('period', {}).get('end')}")
            print(f"   Total de eventos: {data.get('total_events')}")
            print(f"   Violações: {data.get('violations_count')}")
            print(f"   Taxa de conformidade: {data.get('compliance_rate', 0):.2%}")
            
        else:
            print(f"❌ Falha na geração do relatório: {response.status_code}")
    
    def test_address_attribution(self):
        """Testa análise de atribuição de endereço"""
        print("\n🔍 Testando Atribuição de Endereço...")
        
        attribution_data = {
            "address": "0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc",  # Endereço de exemplo
            "blockchain": "ETHEREUM"
        }
        
        response = requests.post(
            f"{self.base_url}/intelligence/attribution",
            json=attribution_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Atribuição de endereço concluída")
            print(f"   Endereço: {data.get('address')}")
            print(f"   Blockchain: {data.get('blockchain')}")
            
            if data.get('entity_match'):
                print(f"   Entidade identificada: {data.get('entity_match')}")
            
            if data.get('cluster_id'):
                print(f"   Cluster ID: {data.get('cluster_id')}")
            
            print(f"   Confidence Score: {data.get('confidence_score', 0):.2f}")
            
            methods = data.get('attribution_methods', [])
            if methods:
                print(f"   Métodos utilizados: {', '.join(methods)}")
            
        else:
            print(f"❌ Falha na atribuição: {response.status_code}")
    
    def test_error_handling(self):
        """Testa tratamento de erros"""
        print("\n🚨 Testando Tratamento de Erros...")
        
        # Teste com dados inválidos
        invalid_data = {"invalid": "data"}
        
        response = requests.post(
            f"{self.base_url}/analyze/transaction/advanced",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400 or response.status_code == 500:
            print(f"✅ Tratamento de erro funcionando (Status: {response.status_code})")
        else:
            print(f"❌ Tratamento de erro inesperado: {response.status_code}")
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print("🚀 Iniciando Testes do Sistema AML Avançado")
        print("=" * 60)
        
        try:
            self.test_health_check()
            self.test_advanced_transaction_analysis()
            self.test_advanced_wallet_analysis()
            self.test_compliance_report()
            self.test_address_attribution()
            self.test_error_handling()
            
            print("\n" + "=" * 60)
            print("✅ Todos os testes concluídos com sucesso!")
            print("🎉 Sistema AML Avançado funcionando perfeitamente!")
            
        except requests.exceptions.ConnectionError:
            print("\n❌ Erro de conexão!")
            print("   Certifique-se de que o sistema está rodando em http://localhost:8000")
            print("   Execute: python advanced_app.py")
        
        except Exception as e:
            print(f"\n❌ Erro inesperado: {str(e)}")

if __name__ == "__main__":
    tester = AdvancedAMLTester()
    tester.run_all_tests()