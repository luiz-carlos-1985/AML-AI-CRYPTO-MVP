"""
Sistema AML Avançado - Aplicação Principal
Integra todos os módulos avançados com proteções e conformidade regulatória
"""

from flask import Flask, request, jsonify, abort, g
from flask_cors import CORS
import numpy as np
import time
import logging
from datetime import datetime, timedelta
import os
import sys

# Importar módulos avançados
try:
    from compliance.regulatory_engine import RegulatoryEngine, RegulatoryFramework
    from advanced_ml.graph_neural_network import GraphNeuralNetwork, TransactionEdge
    from security.anti_tampering import get_protection_system, CodeObfuscator
    from security.secure_api import SecureAPIManager, require_auth, rate_limit, validate_input, security_headers
    from security.security_audit import SecurityAuditor
    from security.compliance_monitor import ComplianceMonitor, ComplianceFramework
    from blockchain_analysis.chain_intelligence import ChainIntelligence, BlockchainType
except ImportError as e:
    print(f"Error importing advanced modules: {e}")
    sys.exit(1)

# Configurar logging avançado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('aml_advanced.log'),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
CORS(app)

# Inicializar sistemas de segurança
secure_api = SecureAPIManager()
security_auditor = SecurityAuditor()
compliance_monitor = ComplianceMonitor()

class AdvancedAMLSystem:
    """Sistema AML de classe mundial com funcionalidades avançadas"""
    
    def __init__(self):
        # Validar licença e inicializar proteções
        self.license_key = os.getenv('AML_LICENSE_KEY', 'demo_license_2024')
        self.protection_system = get_protection_system()
        
        # Verificar integridade do sistema
        if not self.protection_system.runtime_protection_check():
            raise RuntimeError("System integrity compromised")
        
        # Inicializar módulos avançados
        try:
            self.regulatory_engine = RegulatoryEngine(self.license_key)
            self.graph_nn = GraphNeuralNetwork(self.license_key)
            self.chain_intelligence = ChainIntelligence(self.license_key)
        except ValueError as e:
            logging.error(f"License validation failed: {e}")
            raise
        
        self.obfuscator = CodeObfuscator()
        
        # Estatísticas do sistema
        self.analysis_count = 0
        self.start_time = time.time()
        
        # Iniciar monitoramento de conformidade
        compliance_monitor.start_monitoring()
        
        logging.info("Advanced AML System initialized successfully")
    
    def comprehensive_transaction_analysis(self, transaction_data: dict) -> dict:
        """Análise abrangente de transação com todos os módulos"""
        self.analysis_count += 1
        
        # Verificação de proteção em tempo real
        if not self.protection_system.runtime_protection_check():
            return {'error': 'System protection activated', 'code': 'SECURITY_VIOLATION'}
        
        try:
            # 1. Análise de conformidade regulatória
            jurisdictions = [
                RegulatoryFramework.FATF,
                RegulatoryFramework.BSA,
                RegulatoryFramework.EU_5AMLD
            ]
            compliance_result = self.regulatory_engine.evaluate_compliance(
                transaction_data, jurisdictions
            )
            
            # 2. Análise de grafo neural
            tx_edge = TransactionEdge(
                from_addr=transaction_data.get('fromAddress', ''),
                to_addr=transaction_data.get('toAddress', ''),
                amount=float(transaction_data.get('amount', 0)),
                timestamp=int(time.time()),
                tx_hash=transaction_data.get('hash', ''),
                risk_flags=transaction_data.get('flags', [])
            )
            
            self.graph_nn.add_transaction(tx_edge)
            graph_analysis = self.graph_nn.comprehensive_analysis(
                transaction_data.get('fromAddress', '')
            )
            
            # 3. Inteligência blockchain
            blockchain_type = BlockchainType.ETHEREUM  # Default
            if 'blockchain' in transaction_data:
                try:
                    blockchain_type = BlockchainType(transaction_data['blockchain'])
                except ValueError:
                    pass
            
            intelligence_report = self.chain_intelligence.generate_intelligence_report(
                transaction_data.get('fromAddress', ''), blockchain_type
            )
            
            # 4. Calcular risco agregado
            risk_scores = [
                compliance_result.get('risk_level_score', 0),
                graph_analysis.get('overall_risk_score', 0),
                intelligence_report.get('overall_risk_score', 0)
            ]
            
            # Usar média ponderada com pesos diferentes
            weights = [0.4, 0.35, 0.25]  # Compliance tem maior peso
            aggregated_risk = sum(score * weight for score, weight in zip(risk_scores, weights))
            
            # Determinar nível de risco final
            if aggregated_risk >= 80:
                risk_level = 'CRITICAL'
            elif aggregated_risk >= 60:
                risk_level = 'HIGH'
            elif aggregated_risk >= 40:
                risk_level = 'MEDIUM'
            else:
                risk_level = 'LOW'
            
            # Compilar flags de todos os módulos
            all_flags = set(transaction_data.get('flags', []))
            all_flags.update(graph_analysis.get('risk_factors', []))
            
            if not compliance_result.get('compliant', True):
                all_flags.add('REGULATORY_VIOLATION')
            
            if intelligence_report.get('attribution', {}).get('entity_match'):
                all_flags.add('KNOWN_ENTITY')
            
            return {
                'riskScore': int(aggregated_risk),
                'riskLevel': risk_level,
                'flags': list(all_flags),
                'confidence': min(max(aggregated_risk / 100, 0.1), 0.95),
                'compliance': compliance_result,
                'graph_analysis': {
                    'layering_detected': graph_analysis['layering']['max_risk_score'] > 50,
                    'smurfing_detected': graph_analysis['smurfing'].get('detected', False),
                    'round_tripping_detected': graph_analysis['round_tripping']['max_risk_score'] > 40
                },
                'intelligence': {
                    'entity_attribution': intelligence_report['attribution'].get('entity_match'),
                    'cluster_id': intelligence_report['attribution'].get('cluster_id'),
                    'cross_chain_risk': intelligence_report['cross_chain_analysis']['highest_risk_score']
                },
                'analysis_id': self.protection_system.obfuscate_sensitive_data(
                    f"AML_{self.analysis_count}_{int(time.time())}"
                ),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Analysis error: {str(e)}")
            return {
                'error': 'Analysis failed',
                'riskScore': 100,
                'riskLevel': 'CRITICAL',
                'flags': ['ANALYSIS_ERROR']
            }
    
    def advanced_wallet_analysis(self, wallet_data: dict) -> dict:
        """Análise avançada de carteira com clustering e atribuição"""
        address = wallet_data.get('address', '')
        blockchain = wallet_data.get('blockchain', 'ETHEREUM')
        
        try:
            blockchain_type = BlockchainType(blockchain)
        except ValueError:
            blockchain_type = BlockchainType.ETHEREUM
        
        # Análise de inteligência completa
        intelligence_report = self.chain_intelligence.generate_intelligence_report(
            address, blockchain_type
        )
        
        # Análise de transações se fornecidas
        transactions = wallet_data.get('transactions', [])
        if transactions:
            # Adicionar transações ao grafo
            for tx in transactions:
                tx_edge = TransactionEdge(
                    from_addr=tx.get('fromAddress', address),
                    to_addr=tx.get('toAddress', ''),
                    amount=float(tx.get('amount', 0)),
                    timestamp=tx.get('timestamp', int(time.time())),
                    tx_hash=tx.get('hash', ''),
                    risk_flags=tx.get('flags', [])
                )
                self.graph_nn.add_transaction(tx_edge)
            
            # Análise de clustering
            addresses = [tx.get('fromAddress', '') for tx in transactions] + \
                       [tx.get('toAddress', '') for tx in transactions]
            addresses = list(set(filter(None, addresses)))
            
            clustering_analysis = self.graph_nn.analyze_address_clustering(addresses)
        else:
            clustering_analysis = {'clusters': [], 'total_clusters': 0}
        
        # Calcular risco da carteira
        wallet_risk = intelligence_report.get('overall_risk_score', 0)
        
        if clustering_analysis['total_clusters'] > 0:
            max_cluster_risk = max([c['risk_score'] for c in clustering_analysis['clusters']], default=0)
            wallet_risk = max(wallet_risk, max_cluster_risk)
        
        # Determinar nível de risco
        if wallet_risk >= 70:
            risk_level = 'CRITICAL'
        elif wallet_risk >= 50:
            risk_level = 'HIGH'
        elif wallet_risk >= 30:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        return {
            'address': address,
            'blockchain': blockchain,
            'riskScore': int(wallet_risk),
            'riskLevel': risk_level,
            'attribution': intelligence_report['attribution'],
            'clustering': {
                'total_clusters': clustering_analysis['total_clusters'],
                'largest_cluster_size': clustering_analysis.get('max_cluster_size', 0)
            },
            'cross_chain_activity': intelligence_report['cross_chain_analysis'],
            'intelligence_summary': intelligence_report['intelligence_summary']
        }
    
    def get_system_status(self) -> dict:
        """Status detalhado do sistema"""
        uptime = time.time() - self.start_time
        protection_status = self.protection_system.get_system_status()
        
        return {
            'status': 'operational',
            'version': '2.0.0-advanced',
            'uptime_seconds': int(uptime),
            'analyses_performed': self.analysis_count,
            'protection_active': protection_status['protection_active'],
            'modules': {
                'regulatory_engine': True,
                'graph_neural_network': True,
                'chain_intelligence': True,
                'anti_tampering': protection_status['protection_active']
            },
            'performance': {
                'avg_analysis_time': '< 500ms',
                'supported_blockchains': len(BlockchainType),
                'regulatory_frameworks': len(RegulatoryFramework)
            }
        }

# Inicializar sistema avançado
try:
    advanced_aml = AdvancedAMLSystem()
except Exception as e:
    logging.error(f"Failed to initialize advanced AML system: {e}")
    sys.exit(1)

# Endpoints da API

@app.route('/health', methods=['GET'])
@security_headers()
def health():
    """Health check avançado"""
    return jsonify(advanced_aml.get_system_status())

@app.route('/analyze/transaction/advanced', methods=['POST'])
@security_headers()
@rate_limit(limit=100, window=3600)
@validate_input()
@require_auth(permissions=['transaction_analysis'])
def analyze_transaction_advanced():
    """Análise avançada de transação"""
    try:
        data = request.json
        if not data:
            abort(400, description="No transaction data provided")
        
        # Log evento de segurança
        secure_api.log_security_event(
            'TRANSACTION_ANALYSIS',
            g.current_user.get('user_id', 'unknown'),
            {'transaction_hash': data.get('hash', 'unknown')}
        )
        
        result = advanced_aml.comprehensive_transaction_analysis(data)
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Transaction analysis error: {str(e)}")
        return jsonify({'error': 'Analysis failed', 'details': str(e)}), 500

@app.route('/analyze/wallet/advanced', methods=['POST'])
@security_headers()
@rate_limit(limit=50, window=3600)
@validate_input()
@require_auth(permissions=['wallet_analysis'])
def analyze_wallet_advanced():
    """Análise avançada de carteira"""
    try:
        data = request.json
        if not data or 'address' not in data:
            abort(400, description="Wallet address required")
        
        # Log evento de segurança
        secure_api.log_security_event(
            'WALLET_ANALYSIS',
            g.current_user.get('user_id', 'unknown'),
            {'wallet_address': data.get('address', 'unknown')}
        )
        
        result = advanced_aml.advanced_wallet_analysis(data)
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Wallet analysis error: {str(e)}")
        return jsonify({'error': 'Analysis failed', 'details': str(e)}), 500

@app.route('/compliance/report', methods=['POST'])
@security_headers()
@rate_limit(limit=10, window=3600)
@require_auth(permissions=['compliance_admin'])
def generate_compliance_report():
    """Gera relatório de conformidade"""
    try:
        data = request.json
        start_date = datetime.fromisoformat(data.get('start_date', 
                                          (datetime.now() - timedelta(days=30)).isoformat()))
        end_date = datetime.fromisoformat(data.get('end_date', datetime.now().isoformat()))
        
        # Log evento de segurança
        secure_api.log_security_event(
            'COMPLIANCE_REPORT_GENERATED',
            g.current_user.get('user_id', 'unknown'),
            {'start_date': start_date.isoformat(), 'end_date': end_date.isoformat()}
        )
        
        report = advanced_aml.regulatory_engine.generate_compliance_report(start_date, end_date)
        return jsonify(report)
    
    except Exception as e:
        logging.error(f"Compliance report error: {str(e)}")
        return jsonify({'error': 'Report generation failed', 'details': str(e)}), 500

@app.route('/intelligence/attribution', methods=['POST'])
@security_headers()
@rate_limit(limit=200, window=3600)
@validate_input()
@require_auth(permissions=['intelligence_analysis'])
def address_attribution():
    """Análise de atribuição de endereço"""
    try:
        data = request.json
        address = data.get('address')
        blockchain = data.get('blockchain', 'ETHEREUM')
        
        if not address:
            abort(400, description="Address required")
        
        try:
            blockchain_type = BlockchainType(blockchain)
        except ValueError:
            blockchain_type = BlockchainType.ETHEREUM
        
        # Log evento de segurança
        secure_api.log_security_event(
            'ADDRESS_ATTRIBUTION',
            g.current_user.get('user_id', 'unknown'),
            {'address': address, 'blockchain': blockchain}
        )
        
        result = advanced_aml.chain_intelligence.analyze_address_attribution(address, blockchain_type)
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Attribution analysis error: {str(e)}")
        return jsonify({'error': 'Attribution failed', 'details': str(e)}), 500

# Novos endpoints de segurança

@app.route('/security/audit', methods=['POST'])
@security_headers()
@require_auth(permissions=['security_admin'])
def run_security_audit():
    """Executa auditoria de segurança completa"""
    try:
        audit_results = security_auditor.run_comprehensive_security_audit()
        
        # Log evento crítico
        secure_api.log_security_event(
            'SECURITY_AUDIT_EXECUTED',
            g.current_user.get('user_id', 'unknown'),
            {'vulnerabilities_found': len(audit_results['vulnerabilities'])}
        )
        
        return jsonify(audit_results)
    
    except Exception as e:
        logging.error(f"Security audit error: {str(e)}")
        return jsonify({'error': 'Audit failed', 'details': str(e)}), 500

@app.route('/compliance/dashboard', methods=['GET'])
@security_headers()
@require_auth(permissions=['compliance_view'])
def compliance_dashboard():
    """Dashboard de conformidade"""
    try:
        dashboard = compliance_monitor.get_compliance_dashboard()
        return jsonify(dashboard)
    
    except Exception as e:
        logging.error(f"Compliance dashboard error: {str(e)}")
        return jsonify({'error': 'Dashboard failed', 'details': str(e)}), 500

@app.route('/compliance/certification/<framework>', methods=['GET'])
@security_headers()
@require_auth(permissions=['compliance_admin'])
def certification_readiness(framework):
    """Avalia prontidão para certificação"""
    try:
        framework_enum = ComplianceFramework(framework.upper())
        readiness = compliance_monitor.get_certification_readiness(framework_enum)
        return jsonify(readiness)
    
    except ValueError:
        return jsonify({'error': 'Invalid framework'}), 400
    except Exception as e:
        logging.error(f"Certification readiness error: {str(e)}")
        return jsonify({'error': 'Assessment failed', 'details': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
@security_headers()
@rate_limit(limit=5, window=300)  # 5 tentativas por 5 minutos
@validate_input()
def login():
    """Endpoint de autenticação segura"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Verificar account lockout
        if not secure_api.track_failed_login(username):
            secure_api.log_security_event(
                'LOGIN_BLOCKED_ACCOUNT_LOCKED',
                username,
                {'reason': 'Too many failed attempts'}
            )
            return jsonify({'error': 'Account temporarily locked'}), 423
        
        # Validar credenciais (simulado)
        if username == 'admin' and password == 'SecurePass123!':
            # Reset failed login counter
            secure_api.reset_failed_login(username)
            
            # Gerar token
            token = secure_api.generate_secure_token(
                username, 
                ['transaction_analysis', 'wallet_analysis', 'compliance_admin', 'security_admin']
            )
            
            secure_api.log_security_event(
                'LOGIN_SUCCESS',
                username,
                {'method': 'password'}
            )
            
            return jsonify({
                'token': token,
                'expires_in': 3600,
                'permissions': ['transaction_analysis', 'wallet_analysis', 'compliance_admin', 'security_admin']
            })
        else:
            secure_api.log_security_event(
                'LOGIN_FAILED',
                username,
                {'reason': 'Invalid credentials'}
            )
            return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Authentication failed'}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request', 'message': error.description}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({'error': 'Forbidden', 'message': 'Insufficient permissions'}), 403

@app.errorhandler(429)
def rate_limit_exceeded(error):
    return jsonify({'error': 'Rate limit exceeded', 'message': 'Too many requests'}), 429

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print('🚀 Advanced AML System starting...')
    print('🔒 Security protections: ACTIVE')
    print('⚖️  Regulatory compliance: ENABLED')
    print('🧠 AI/ML modules: LOADED')
    print('🔗 Blockchain intelligence: READY')
    print('🛡️  Security auditing: ENABLED')
    print('📊 Compliance monitoring: ACTIVE')
    print('')
    print('Secure endpoints available:')
    print('  POST /auth/login')
    print('  POST /analyze/transaction/advanced (AUTH)')
    print('  POST /analyze/wallet/advanced (AUTH)')
    print('  POST /compliance/report (AUTH)')
    print('  POST /intelligence/attribution (AUTH)')
    print('  POST /security/audit (AUTH)')
    print('  GET  /compliance/dashboard (AUTH)')
    print('  GET  /compliance/certification/<framework> (AUTH)')
    print('')
    print('Security features:')
    print('  ✅ JWT Authentication')
    print('  ✅ Rate Limiting')
    print('  ✅ Input Validation')
    print('  ✅ Security Headers')
    print('  ✅ Audit Logging')
    print('  ✅ Compliance Monitoring')
    print('')
    
    # Configurar SSL para produção
    context = None
    if os.path.exists('cert.pem') and os.path.exists('key.pem'):
        context = ('cert.pem', 'key.pem')
        print('🔐 SSL/TLS: ENABLED')
    else:
        print('⚠️  SSL/TLS: DISABLED (development mode)')
    
    app.run(host='0.0.0.0', port=8000, debug=False, ssl_context=context)