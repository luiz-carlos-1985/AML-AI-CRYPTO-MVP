import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta

class RiskAnalyzer:
    """
    Analisador de risco para transações de criptomoedas
    Utiliza heurísticas e padrões para detectar atividades suspeitas
    """
    
    # Endereços conhecidos de mixers e serviços suspeitos (exemplo)
    KNOWN_MIXERS = [
        '1mixer', '1tumbler', '1tornado', 
        '0xmixer', '0xtornado', '0xtumbler'
    ]
    
    # Thresholds para classificação de risco
    RISK_THRESHOLDS = {
        'LOW': 30,
        'MEDIUM': 60,
        'HIGH': 85,
        'CRITICAL': 100
    }
    
    def analyze_wallet(self, address: str, blockchain: str, transactions: List[Dict]) -> Dict:
        """Analisa o risco de uma carteira baseado em seu histórico"""
        
        risk_score = 0
        flags = []
        
        # 1. Verificar se é endereço de mixer conhecido
        if self._is_mixer_address(address):
            risk_score += 40
            flags.append('MIXER_ADDRESS')
        
        # 2. Analisar padrões de transações
        if transactions:
            tx_analysis = self._analyze_transaction_patterns(transactions)
            risk_score += tx_analysis['score']
            flags.extend(tx_analysis['flags'])
        
        # 3. Verificar volume total
        total_volume = sum(tx.get('amount', 0) for tx in transactions)
        if total_volume > 100:  # Threshold alto de volume
            risk_score += 15
            flags.append('HIGH_VOLUME')
        
        # 4. Verificar frequência de transações
        if len(transactions) > 50:
            risk_score += 10
            flags.append('HIGH_FREQUENCY')
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'riskScore': min(risk_score, 100),
            'riskLevel': risk_level,
            'flags': flags,
            'explanation': self._generate_explanation(risk_level, flags)
        }
    
    def analyze_transaction(self, tx_hash: str, from_address: str, 
                          to_address: str, amount: float, blockchain: str) -> Dict:
        """Analisa o risco de uma transação específica"""
        
        risk_score = 0
        flags = []
        
        # 1. Verificar endereços envolvidos
        if self._is_mixer_address(from_address):
            risk_score += 35
            flags.append('FROM_MIXER')
        
        if self._is_mixer_address(to_address):
            risk_score += 35
            flags.append('TO_MIXER')
        
        # 2. Verificar valor da transação
        if amount > 50:
            risk_score += 20
            flags.append('LARGE_AMOUNT')
        elif amount > 100:
            risk_score += 30
            flags.append('VERY_LARGE_AMOUNT')
        
        # 3. Verificar padrões suspeitos no hash (exemplo simplificado)
        if self._has_suspicious_pattern(tx_hash):
            risk_score += 10
            flags.append('SUSPICIOUS_PATTERN')
        
        # 4. Análise de blockchain específica
        if blockchain in ['BITCOIN', 'ETHEREUM']:
            # Blockchains mais monitoradas têm análise mais rigorosa
            risk_score += 5
        
        risk_level = self._calculate_risk_level(risk_score)
        
        return {
            'riskScore': min(risk_score, 100),
            'riskLevel': risk_level,
            'flags': flags,
            'explanation': self._generate_explanation(risk_level, flags)
        }
    
    def _analyze_transaction_patterns(self, transactions: List[Dict]) -> Dict:
        """Analisa padrões suspeitos nas transações"""
        score = 0
        flags = []
        
        if not transactions:
            return {'score': 0, 'flags': []}
        
        # Verificar movimentação rápida (churning)
        timestamps = [tx.get('timestamp') for tx in transactions if tx.get('timestamp')]
        if len(timestamps) > 1:
            # Simular análise de velocidade
            if len(transactions) > 10:
                score += 15
                flags.append('RAPID_MOVEMENT')
        
        # Verificar valores similares (possível estruturação)
        amounts = [tx.get('amount', 0) for tx in transactions]
        if len(amounts) > 3:
            avg_amount = np.mean(amounts)
            similar_amounts = sum(1 for a in amounts if abs(a - avg_amount) < avg_amount * 0.1)
            if similar_amounts > len(amounts) * 0.7:
                score += 20
                flags.append('STRUCTURING_PATTERN')
        
        return {'score': score, 'flags': flags}
    
    def _is_mixer_address(self, address: str) -> bool:
        """Verifica se o endereço pertence a um mixer conhecido"""
        address_lower = address.lower()
        return any(mixer in address_lower for mixer in self.KNOWN_MIXERS)
    
    def _has_suspicious_pattern(self, tx_hash: str) -> bool:
        """Verifica padrões suspeitos no hash da transação"""
        # Exemplo simplificado: verificar repetições
        if len(set(tx_hash)) < len(tx_hash) * 0.5:
            return True
        return False
    
    def _calculate_risk_level(self, score: float) -> str:
        """Calcula o nível de risco baseado no score"""
        if score < self.RISK_THRESHOLDS['LOW']:
            return 'LOW'
        elif score < self.RISK_THRESHOLDS['MEDIUM']:
            return 'MEDIUM'
        elif score < self.RISK_THRESHOLDS['HIGH']:
            return 'HIGH'
        else:
            return 'CRITICAL'
    
    def _generate_explanation(self, risk_level: str, flags: List[str]) -> str:
        """Gera explicação legível do risco detectado"""
        if risk_level == 'LOW':
            return "Transaction appears normal with no significant risk indicators."
        
        explanation = f"Risk level: {risk_level}. "
        
        if flags:
            explanation += "Detected issues: "
            flag_descriptions = {
                'MIXER_ADDRESS': 'Address associated with mixing service',
                'FROM_MIXER': 'Transaction originates from mixer',
                'TO_MIXER': 'Transaction sent to mixer',
                'LARGE_AMOUNT': 'Unusually large transaction amount',
                'VERY_LARGE_AMOUNT': 'Extremely large transaction amount',
                'HIGH_VOLUME': 'High cumulative transaction volume',
                'HIGH_FREQUENCY': 'Unusually high transaction frequency',
                'RAPID_MOVEMENT': 'Rapid movement of funds detected',
                'STRUCTURING_PATTERN': 'Possible structuring pattern detected',
                'SUSPICIOUS_PATTERN': 'Suspicious transaction pattern'
            }
            
            descriptions = [flag_descriptions.get(flag, flag) for flag in flags]
            explanation += "; ".join(descriptions) + "."
        
        return explanation
