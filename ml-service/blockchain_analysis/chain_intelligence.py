"""
Sistema de Inteligência Blockchain Avançado
Análise multi-chain com detecção de padrões sofisticados e attribution de entidades
"""

import hashlib
import json
import time
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass
from enum import Enum
import numpy as np
from collections import defaultdict, deque

class BlockchainType(Enum):
    BITCOIN = "BITCOIN"
    ETHEREUM = "ETHEREUM"
    BINANCE_SMART_CHAIN = "BSC"
    POLYGON = "POLYGON"
    AVALANCHE = "AVALANCHE"
    SOLANA = "SOLANA"
    CARDANO = "CARDANO"
    TRON = "TRON"

@dataclass
class EntityProfile:
    entity_id: str
    entity_type: str  # 'exchange', 'mixer', 'defi', 'bridge', 'wallet', 'darknet'
    risk_level: str
    addresses: Set[str]
    total_volume: float
    transaction_count: int
    first_seen: int
    last_seen: int
    jurisdictions: List[str]
    compliance_status: str

@dataclass
class CrossChainTransaction:
    source_chain: BlockchainType
    dest_chain: BlockchainType
    source_tx: str
    dest_tx: str
    bridge_address: str
    amount: float
    timestamp: int
    risk_score: float

class ChainIntelligence:
    """Sistema de inteligência blockchain com capacidades multi-chain"""
    
    def __init__(self, license_key: str):
        self._license_key = license_key
        self._validate_license()
        self.entity_database = {}
        self.address_clusters = defaultdict(set)
        self.cross_chain_flows = []
        self.risk_patterns = self._initialize_risk_patterns()
        self.known_entities = self._load_known_entities()
        
    def _validate_license(self):
        """Validação de licença específica para inteligência blockchain"""
        expected = "9a8b7c6d5e4f"
        actual = hashlib.sha256(self._license_key.encode()).hexdigest()[:12]
        if actual != expected:
            raise ValueError("Blockchain intelligence license invalid")
    
    def _initialize_risk_patterns(self) -> Dict:
        """Inicializa padrões de risco conhecidos"""
        return {
            'tornado_cash_patterns': {
                'deposit_amounts': [0.1, 1, 10, 100],  # ETH
                'withdrawal_delay_min': 3600,  # 1 hora mínima
                'anonymity_set_threshold': 100
            },
            'bridge_abuse': {
                'rapid_bridge_usage': 5,  # 5 bridges em 24h
                'amount_splitting_threshold': 0.95,  # 95% similaridade
                'cross_chain_velocity': 10  # 10 chains em 1 semana
            },
            'defi_exploitation': {
                'flash_loan_indicators': ['aave', 'compound', 'dydx'],
                'mev_bot_patterns': ['sandwich', 'arbitrage', 'liquidation'],
                'governance_attack_threshold': 0.51  # 51% dos tokens
            },
            'darknet_indicators': {
                'known_markets': ['silk_road', 'alphabay', 'dream_market'],
                'mixing_patterns': ['peel_chain', 'fan_out', 'consolidation'],
                'payment_processors': ['btc_e', 'liberty_reserve']
            }
        }
    
    def _load_known_entities(self) -> Dict[str, EntityProfile]:
        """Carrega base de dados de entidades conhecidas"""
        # Base de dados proprietária de entidades
        known_entities = {
            'binance_hot_wallet': EntityProfile(
                entity_id='binance_001',
                entity_type='exchange',
                risk_level='LOW',
                addresses={'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'},  # Exemplo
                total_volume=1000000000.0,
                transaction_count=10000000,
                first_seen=1230940800,  # Genesis block
                last_seen=int(time.time()),
                jurisdictions=['Malta', 'Cayman Islands'],
                compliance_status='REGULATED'
            ),
            'tornado_cash_mixer': EntityProfile(
                entity_id='tornado_001',
                entity_type='mixer',
                risk_level='CRITICAL',
                addresses={'0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc'},  # Exemplo
                total_volume=500000000.0,
                transaction_count=1000000,
                first_seen=1566000000,
                last_seen=int(time.time()),
                jurisdictions=['Unknown'],
                compliance_status='SANCTIONED'
            )
        }
        
        return known_entities
    
    def analyze_address_attribution(self, address: str, blockchain: BlockchainType) -> Dict:
        """Análise de atribuição de endereço usando heurísticas avançadas"""
        attribution_result = {
            'address': address,
            'blockchain': blockchain.value,
            'entity_match': None,
            'cluster_id': None,
            'confidence_score': 0.0,
            'attribution_methods': [],
            'risk_indicators': []
        }
        
        # 1. Verificar correspondência direta com entidades conhecidas
        for entity_id, entity in self.known_entities.items():
            if address in entity.addresses:
                attribution_result['entity_match'] = entity_id
                attribution_result['confidence_score'] = 0.95
                attribution_result['attribution_methods'].append('DIRECT_MATCH')
                break
        
        # 2. Análise de clustering baseada em heurísticas
        if not attribution_result['entity_match']:
            cluster_analysis = self._perform_address_clustering(address, blockchain)
            if cluster_analysis['cluster_found']:
                attribution_result['cluster_id'] = cluster_analysis['cluster_id']
                attribution_result['confidence_score'] = cluster_analysis['confidence']
                attribution_result['attribution_methods'].extend(cluster_analysis['methods'])
        
        # 3. Análise de padrões comportamentais
        behavioral_analysis = self._analyze_behavioral_patterns(address, blockchain)
        attribution_result['risk_indicators'].extend(behavioral_analysis['indicators'])
        
        # 4. Análise de metadados on-chain
        metadata_analysis = self._analyze_onchain_metadata(address, blockchain)
        attribution_result['attribution_methods'].extend(metadata_analysis['methods'])
        
        return attribution_result
    
    def _perform_address_clustering(self, address: str, blockchain: BlockchainType) -> Dict:
        """Realiza clustering de endereços usando múltiplas heurísticas"""
        clustering_methods = {
            'common_input_ownership': self._common_input_heuristic,
            'change_address_detection': self._change_address_heuristic,
            'temporal_clustering': self._temporal_clustering_heuristic,
            'amount_correlation': self._amount_correlation_heuristic
        }
        
        cluster_evidence = []
        
        for method_name, method_func in clustering_methods.items():
            try:
                evidence = method_func(address, blockchain)
                if evidence['confidence'] > 0.3:
                    cluster_evidence.append({
                        'method': method_name,
                        'confidence': evidence['confidence'],
                        'related_addresses': evidence['addresses']
                    })
            except Exception:
                continue
        
        if cluster_evidence:
            # Combinar evidências para determinar cluster
            combined_confidence = min(sum(e['confidence'] for e in cluster_evidence) / len(cluster_evidence), 0.9)
            all_addresses = set()
            for evidence in cluster_evidence:
                all_addresses.update(evidence['related_addresses'])
            
            cluster_id = hashlib.sha256(f"{address}:{blockchain.value}".encode()).hexdigest()[:16]
            
            return {
                'cluster_found': True,
                'cluster_id': cluster_id,
                'confidence': combined_confidence,
                'methods': [e['method'] for e in cluster_evidence],
                'related_addresses': list(all_addresses)
            }
        
        return {'cluster_found': False}
    
    def _common_input_heuristic(self, address: str, blockchain: BlockchainType) -> Dict:
        """Heurística de propriedade comum de inputs"""
        # Simulação de análise de inputs comuns
        related_addresses = set()
        confidence = 0.0
        
        # Em implementação real, analisaria transações on-chain
        # Por ora, simulamos com lógica baseada em padrões de endereço
        if blockchain == BlockchainType.BITCOIN:
            # Endereços Bitcoin com padrões similares
            if address.startswith('1') or address.startswith('3'):
                confidence = 0.6
                related_addresses.add(f"{address[:-4]}abcd")  # Endereço relacionado simulado
        
        return {
            'confidence': confidence,
            'addresses': related_addresses
        }
    
    def _change_address_heuristic(self, address: str, blockchain: BlockchainType) -> Dict:
        """Heurística de detecção de endereços de troco"""
        confidence = 0.0
        related_addresses = set()
        
        # Simulação de detecção de endereços de troco
        if len(address) > 20:  # Endereços mais longos podem ser de troco
            confidence = 0.4
            related_addresses.add(f"change_{address[:10]}")
        
        return {
            'confidence': confidence,
            'addresses': related_addresses
        }
    
    def _temporal_clustering_heuristic(self, address: str, blockchain: BlockchainType) -> Dict:
        """Clustering baseado em padrões temporais"""
        confidence = 0.0
        related_addresses = set()
        
        # Simulação de análise temporal
        current_time = int(time.time())
        if current_time % 100 < 50:  # Simulação de padrão temporal
            confidence = 0.5
            related_addresses.add(f"temporal_{address[:8]}")
        
        return {
            'confidence': confidence,
            'addresses': related_addresses
        }
    
    def _amount_correlation_heuristic(self, address: str, blockchain: BlockchainType) -> Dict:
        """Clustering baseado em correlação de valores"""
        confidence = 0.0
        related_addresses = set()
        
        # Simulação de correlação de valores
        address_hash = hashlib.sha256(address.encode()).hexdigest()
        if int(address_hash[:2], 16) > 128:  # 50% dos endereços
            confidence = 0.3
            related_addresses.add(f"corr_{address[:6]}")
        
        return {
            'confidence': confidence,
            'addresses': related_addresses
        }
    
    def _analyze_behavioral_patterns(self, address: str, blockchain: BlockchainType) -> Dict:
        """Analisa padrões comportamentais do endereço"""
        indicators = []
        
        # Simulação de análise comportamental
        address_int = int(hashlib.sha256(address.encode()).hexdigest()[:8], 16)
        
        if address_int % 10 == 0:
            indicators.append('ROUND_AMOUNT_PATTERN')
        
        if address_int % 7 == 0:
            indicators.append('REGULAR_TIMING_PATTERN')
        
        if address_int % 13 == 0:
            indicators.append('MIXING_SERVICE_INTERACTION')
        
        return {'indicators': indicators}
    
    def _analyze_onchain_metadata(self, address: str, blockchain: BlockchainType) -> Dict:
        """Analisa metadados on-chain para atribuição"""
        methods = []
        
        # Simulação de análise de metadados
        if blockchain == BlockchainType.ETHEREUM:
            methods.append('CONTRACT_CREATION_ANALYSIS')
            methods.append('ENS_DOMAIN_LOOKUP')
        elif blockchain == BlockchainType.BITCOIN:
            methods.append('SCRIPT_TYPE_ANALYSIS')
            methods.append('ADDRESS_REUSE_PATTERN')
        
        return {'methods': methods}
    
    def detect_cross_chain_flows(self, transactions: List[Dict]) -> Dict:
        """Detecta fluxos cross-chain suspeitos"""
        cross_chain_flows = []
        bridge_usage = defaultdict(list)
        
        for tx in transactions:
            # Detectar uso de bridges
            if self._is_bridge_transaction(tx):
                bridge_addr = tx.get('bridge_address', 'unknown')
                bridge_usage[bridge_addr].append(tx)
        
        # Analisar padrões de uso de bridge
        for bridge_addr, bridge_txs in bridge_usage.items():
            if len(bridge_txs) > self.risk_patterns['bridge_abuse']['rapid_bridge_usage']:
                flow_analysis = self._analyze_bridge_flow_pattern(bridge_txs)
                if flow_analysis['suspicious']:
                    cross_chain_flows.append({
                        'bridge_address': bridge_addr,
                        'transaction_count': len(bridge_txs),
                        'risk_score': flow_analysis['risk_score'],
                        'pattern_type': flow_analysis['pattern_type'],
                        'total_volume': sum(tx.get('amount', 0) for tx in bridge_txs)
                    })
        
        return {
            'detected_flows': cross_chain_flows,
            'total_bridges_used': len(bridge_usage),
            'highest_risk_score': max([f['risk_score'] for f in cross_chain_flows], default=0)
        }
    
    def _is_bridge_transaction(self, tx: Dict) -> bool:
        """Identifica se uma transação é de bridge cross-chain"""
        bridge_indicators = [
            'bridge', 'portal', 'wormhole', 'multichain', 'anyswap',
            'polygon', 'arbitrum', 'optimism', 'avalanche'
        ]
        
        to_address = tx.get('toAddress', '').lower()
        return any(indicator in to_address for indicator in bridge_indicators)
    
    def _analyze_bridge_flow_pattern(self, bridge_transactions: List[Dict]) -> Dict:
        """Analisa padrão de fluxo em bridge para detectar suspeitas"""
        amounts = [tx.get('amount', 0) for tx in bridge_transactions]
        timestamps = [tx.get('timestamp', 0) for tx in bridge_transactions]
        
        # Verificar splitting de valores
        amount_similarity = self._calculate_amount_similarity(amounts)
        
        # Verificar velocidade de transações
        time_intervals = [timestamps[i+1] - timestamps[i] for i in range(len(timestamps)-1)]
        avg_interval = np.mean(time_intervals) if time_intervals else 0
        
        risk_score = 0
        pattern_type = 'NORMAL'
        
        if amount_similarity > self.risk_patterns['bridge_abuse']['amount_splitting_threshold']:
            risk_score += 40
            pattern_type = 'AMOUNT_SPLITTING'
        
        if avg_interval < 300:  # Menos de 5 minutos entre transações
            risk_score += 30
            pattern_type = 'RAPID_BRIDGING'
        
        if len(bridge_transactions) > 20:  # Muitas transações
            risk_score += 20
            pattern_type = 'HIGH_FREQUENCY_BRIDGING'
        
        return {
            'suspicious': risk_score > 50,
            'risk_score': min(risk_score, 100),
            'pattern_type': pattern_type
        }
    
    def _calculate_amount_similarity(self, amounts: List[float]) -> float:
        """Calcula similaridade entre valores de transações"""
        if len(amounts) < 2:
            return 0.0
        
        avg_amount = np.mean(amounts)
        if avg_amount == 0:
            return 0.0
        
        similar_count = sum(1 for amount in amounts 
                          if abs(amount - avg_amount) / avg_amount < 0.05)
        
        return similar_count / len(amounts)
    
    def generate_intelligence_report(self, address: str, blockchain: BlockchainType) -> Dict:
        """Gera relatório completo de inteligência para um endereço"""
        attribution = self.analyze_address_attribution(address, blockchain)
        
        # Simulação de dados adicionais
        mock_transactions = [
            {'amount': 1.5, 'timestamp': int(time.time()) - 3600, 'toAddress': 'bridge_addr_1'},
            {'amount': 1.4, 'timestamp': int(time.time()) - 3000, 'toAddress': 'bridge_addr_1'},
            {'amount': 1.6, 'timestamp': int(time.time()) - 2400, 'toAddress': 'bridge_addr_2'}
        ]
        
        cross_chain_analysis = self.detect_cross_chain_flows(mock_transactions)
        
        return {
            'address': address,
            'blockchain': blockchain.value,
            'attribution': attribution,
            'cross_chain_analysis': cross_chain_analysis,
            'overall_risk_score': max(
                attribution['confidence_score'] * 100,
                cross_chain_analysis['highest_risk_score']
            ),
            'intelligence_summary': self._generate_intelligence_summary(attribution, cross_chain_analysis),
            'report_timestamp': int(time.time())
        }
    
    def _generate_intelligence_summary(self, attribution: Dict, cross_chain: Dict) -> str:
        """Gera resumo de inteligência em linguagem natural"""
        summary_parts = []
        
        if attribution['entity_match']:
            summary_parts.append(f"Address attributed to known entity: {attribution['entity_match']}")
        
        if attribution['cluster_id']:
            summary_parts.append(f"Address belongs to cluster: {attribution['cluster_id']}")
        
        if cross_chain['detected_flows']:
            summary_parts.append(f"Detected {len(cross_chain['detected_flows'])} suspicious cross-chain flows")
        
        if not summary_parts:
            summary_parts.append("No significant intelligence indicators detected")
        
        return ". ".join(summary_parts) + "."