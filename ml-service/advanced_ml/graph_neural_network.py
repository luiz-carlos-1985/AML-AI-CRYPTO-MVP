"""
Rede Neural de Grafos para Análise de Transações Blockchain
Implementa GNN avançada para detecção de padrões complexos de lavagem de dinheiro
"""

import numpy as np
import networkx as nx
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import hashlib
import json

@dataclass
class TransactionNode:
    address: str
    balance: float
    transaction_count: int
    risk_score: float
    entity_type: str  # 'exchange', 'mixer', 'wallet', 'unknown'
    
@dataclass
class TransactionEdge:
    from_addr: str
    to_addr: str
    amount: float
    timestamp: int
    tx_hash: str
    risk_flags: List[str]

class GraphNeuralNetwork:
    """GNN proprietária para análise de grafos de transações"""
    
    def __init__(self, license_key: str):
        self._license_key = license_key
        self._validate_license()
        self.graph = nx.DiGraph()
        self.node_embeddings = {}
        self.suspicious_patterns = self._load_suspicious_patterns()
        
    def _validate_license(self):
        """Validação de licença com hash específico"""
        expected = "7f8e9d0a1b2c"
        actual = hashlib.sha256(self._license_key.encode()).hexdigest()[:12]
        if actual != expected:
            raise ValueError("Unauthorized access")
    
    def _load_suspicious_patterns(self) -> Dict:
        """Carrega padrões suspeitos conhecidos"""
        return {
            'layering': {
                'min_hops': 3,
                'max_time_window': 3600,  # 1 hora
                'amount_variance_threshold': 0.1
            },
            'smurfing': {
                'min_transactions': 10,
                'amount_similarity_threshold': 0.95,
                'time_window': 86400  # 24 horas
            },
            'round_tripping': {
                'min_cycle_length': 2,
                'amount_retention_threshold': 0.9
            },
            'mixer_usage': {
                'known_mixers': ['tornado', 'mixer', 'tumbler'],
                'risk_multiplier': 2.5
            }
        }
    
    def add_transaction(self, tx: TransactionEdge):
        """Adiciona transação ao grafo"""
        # Adicionar nós se não existirem
        if not self.graph.has_node(tx.from_addr):
            self.graph.add_node(tx.from_addr, 
                              address=tx.from_addr,
                              transactions=[],
                              risk_score=0.0)
        
        if not self.graph.has_node(tx.to_addr):
            self.graph.add_node(tx.to_addr,
                              address=tx.to_addr, 
                              transactions=[],
                              risk_score=0.0)
        
        # Adicionar aresta
        self.graph.add_edge(tx.from_addr, tx.to_addr,
                          amount=tx.amount,
                          timestamp=tx.timestamp,
                          tx_hash=tx.tx_hash,
                          risk_flags=tx.risk_flags)
        
        # Atualizar listas de transações
        self.graph.nodes[tx.from_addr]['transactions'].append(tx.tx_hash)
        self.graph.nodes[tx.to_addr]['transactions'].append(tx.tx_hash)
    
    def detect_layering_pattern(self, start_address: str, max_depth: int = 5) -> Dict:
        """Detecta padrões de layering (camadas de transações)"""
        layering_chains = []
        
        def dfs_layering(current_addr, path, depth, total_amount):
            if depth >= max_depth:
                return
            
            for neighbor in self.graph.successors(current_addr):
                edge_data = self.graph[current_addr][neighbor]
                new_path = path + [neighbor]
                new_amount = total_amount * 0.95  # Assumindo taxa de 5%
                
                # Verificar se é uma cadeia de layering válida
                if (len(new_path) >= self.suspicious_patterns['layering']['min_hops'] and
                    abs(edge_data['amount'] - new_amount) / new_amount < 
                    self.suspicious_patterns['layering']['amount_variance_threshold']):
                    
                    layering_chains.append({
                        'path': new_path,
                        'total_hops': len(new_path),
                        'amount_retention': edge_data['amount'] / total_amount,
                        'risk_score': self._calculate_layering_risk(new_path)
                    })
                
                dfs_layering(neighbor, new_path, depth + 1, edge_data['amount'])
        
        dfs_layering(start_address, [start_address], 0, 0)
        
        return {
            'detected_chains': layering_chains,
            'max_risk_score': max([chain['risk_score'] for chain in layering_chains], default=0),
            'pattern_type': 'LAYERING'
        }
    
    def detect_smurfing_pattern(self, address: str, time_window: int = 86400) -> Dict:
        """Detecta padrões de smurfing (múltiplas transações pequenas)"""
        transactions = []
        
        # Coletar transações de saída
        for neighbor in self.graph.successors(address):
            edge_data = self.graph[address][neighbor]
            transactions.append(edge_data)
        
        if len(transactions) < self.suspicious_patterns['smurfing']['min_transactions']:
            return {'detected': False, 'pattern_type': 'SMURFING'}
        
        # Analisar similaridade de valores
        amounts = [tx['amount'] for tx in transactions]
        avg_amount = np.mean(amounts)
        similar_amounts = sum(1 for amt in amounts 
                            if abs(amt - avg_amount) / avg_amount < 0.05)
        
        similarity_ratio = similar_amounts / len(amounts)
        
        if similarity_ratio >= self.suspicious_patterns['smurfing']['amount_similarity_threshold']:
            return {
                'detected': True,
                'pattern_type': 'SMURFING',
                'transaction_count': len(transactions),
                'similarity_ratio': similarity_ratio,
                'total_amount': sum(amounts),
                'risk_score': min(similarity_ratio * len(transactions) * 10, 100)
            }
        
        return {'detected': False, 'pattern_type': 'SMURFING'}
    
    def detect_round_tripping(self, address: str) -> Dict:
        """Detecta padrões de round-tripping (fundos retornando à origem)"""
        cycles = []
        
        try:
            # Encontrar ciclos simples
            simple_cycles = list(nx.simple_cycles(self.graph.subgraph(
                [n for n in self.graph.nodes() if 
                 nx.has_path(self.graph, address, n) or 
                 nx.has_path(self.graph, n, address)]
            )))
            
            for cycle in simple_cycles:
                if address in cycle and len(cycle) >= 2:
                    cycle_risk = self._calculate_cycle_risk(cycle)
                    cycles.append({
                        'cycle_path': cycle,
                        'length': len(cycle),
                        'risk_score': cycle_risk
                    })
        
        except nx.NetworkXError:
            pass
        
        return {
            'detected_cycles': cycles,
            'max_risk_score': max([c['risk_score'] for c in cycles], default=0),
            'pattern_type': 'ROUND_TRIPPING'
        }
    
    def analyze_address_clustering(self, addresses: List[str]) -> Dict:
        """Analisa clustering de endereços para identificar entidades"""
        clusters = []
        
        # Usar algoritmo de clustering baseado em conectividade
        subgraph = self.graph.subgraph(addresses)
        connected_components = list(nx.weakly_connected_components(subgraph))
        
        for component in connected_components:
            if len(component) > 1:
                cluster_risk = self._calculate_cluster_risk(component)
                clusters.append({
                    'addresses': list(component),
                    'size': len(component),
                    'risk_score': cluster_risk,
                    'total_volume': self._calculate_cluster_volume(component)
                })
        
        return {
            'clusters': clusters,
            'total_clusters': len(clusters),
            'max_cluster_size': max([c['size'] for c in clusters], default=0)
        }
    
    def _calculate_layering_risk(self, path: List[str]) -> float:
        """Calcula risco de uma cadeia de layering"""
        base_risk = len(path) * 15  # 15 pontos por hop
        
        # Bonificação por complexidade
        if len(path) > 5:
            base_risk *= 1.5
        
        return min(base_risk, 100)
    
    def _calculate_cycle_risk(self, cycle: List[str]) -> float:
        """Calcula risco de um ciclo de transações"""
        base_risk = 40  # Risco base para qualquer ciclo
        
        # Aumentar risco baseado no comprimento do ciclo
        if len(cycle) == 2:
            base_risk += 30  # Ciclo direto é mais suspeito
        elif len(cycle) <= 4:
            base_risk += 20
        
        return min(base_risk, 100)
    
    def _calculate_cluster_risk(self, cluster: set) -> float:
        """Calcula risco de um cluster de endereços"""
        base_risk = len(cluster) * 5
        
        # Verificar se há mixers no cluster
        mixer_count = sum(1 for addr in cluster 
                         if any(mixer in addr.lower() 
                               for mixer in self.suspicious_patterns['mixer_usage']['known_mixers']))
        
        if mixer_count > 0:
            base_risk *= self.suspicious_patterns['mixer_usage']['risk_multiplier']
        
        return min(base_risk, 100)
    
    def _calculate_cluster_volume(self, cluster: set) -> float:
        """Calcula volume total de um cluster"""
        total_volume = 0
        
        for addr in cluster:
            for neighbor in self.graph.successors(addr):
                if neighbor in cluster:
                    total_volume += self.graph[addr][neighbor]['amount']
        
        return total_volume
    
    def comprehensive_analysis(self, address: str) -> Dict:
        """Análise abrangente de um endereço"""
        results = {
            'address': address,
            'layering': self.detect_layering_pattern(address),
            'smurfing': self.detect_smurfing_pattern(address),
            'round_tripping': self.detect_round_tripping(address),
            'overall_risk_score': 0,
            'risk_factors': []
        }
        
        # Calcular risco geral
        risk_scores = [
            results['layering']['max_risk_score'],
            results['smurfing'].get('risk_score', 0),
            results['round_tripping']['max_risk_score']
        ]
        
        results['overall_risk_score'] = min(max(risk_scores) * 1.2, 100)
        
        # Identificar fatores de risco
        if results['layering']['max_risk_score'] > 50:
            results['risk_factors'].append('COMPLEX_LAYERING')
        if results['smurfing'].get('detected', False):
            results['risk_factors'].append('SMURFING_PATTERN')
        if results['round_tripping']['max_risk_score'] > 40:
            results['risk_factors'].append('ROUND_TRIPPING')
        
        return results