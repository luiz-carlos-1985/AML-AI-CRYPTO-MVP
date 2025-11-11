"""
Sistema de Conformidade Regulatória Avançado
Implementa compliance com FATF, BSA, EU 5AMLD, MiCA, e outras regulamentações globais
"""

import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import logging

class RegulatoryFramework(Enum):
    FATF = "FATF"
    BSA = "BSA"  # Bank Secrecy Act (US)
    EU_5AMLD = "EU_5AMLD"  # 5th Anti-Money Laundering Directive
    MICA = "MiCA"  # Markets in Crypto-Assets Regulation
    FINCEN = "FinCEN"
    AUSTRAC = "AUSTRAC"  # Australia
    JAFIC = "JAFIC"  # Japan
    FIU = "FIU"  # Financial Intelligence Unit

@dataclass
class ComplianceRule:
    id: str
    framework: RegulatoryFramework
    description: str
    threshold: float
    mandatory_reporting: bool
    retention_period_days: int
    severity: str

class RegulatoryEngine:
    """Motor de conformidade regulatória com proteção criptográfica"""
    
    def __init__(self, license_key: str):
        self._license_key = license_key
        self._validate_license()
        self._init_compliance_rules()
        self._audit_trail = []
        
    def _validate_license(self):
        """Validação criptográfica da licença"""
        expected_hash = "a1b2c3d4e5f6"  # Hash da licença válida
        license_hash = hashlib.sha256(self._license_key.encode()).hexdigest()[:12]
        if license_hash != expected_hash:
            raise ValueError("Invalid license key")
    
    def _init_compliance_rules(self):
        """Inicializa regras de conformidade por jurisdição"""
        self.rules = {
            RegulatoryFramework.FATF: [
                ComplianceRule("FATF-001", RegulatoryFramework.FATF, 
                             "Suspicious Transaction Reporting", 10000, True, 2555, "HIGH"),
                ComplianceRule("FATF-002", RegulatoryFramework.FATF,
                             "Travel Rule Compliance", 1000, True, 1825, "CRITICAL"),
                ComplianceRule("FATF-003", RegulatoryFramework.FATF,
                             "Enhanced Due Diligence", 25000, True, 2555, "HIGH")
            ],
            RegulatoryFramework.BSA: [
                ComplianceRule("BSA-001", RegulatoryFramework.BSA,
                             "Currency Transaction Report", 10000, True, 1825, "HIGH"),
                ComplianceRule("BSA-002", RegulatoryFramework.BSA,
                             "Suspicious Activity Report", 5000, True, 1825, "CRITICAL")
            ],
            RegulatoryFramework.EU_5AMLD: [
                ComplianceRule("5AMLD-001", RegulatoryFramework.EU_5AMLD,
                             "Virtual Asset Service Provider", 1000, True, 1825, "HIGH"),
                ComplianceRule("5AMLD-002", RegulatoryFramework.EU_5AMLD,
                             "Beneficial Ownership", 0, True, 1825, "CRITICAL")
            ],
            RegulatoryFramework.MICA: [
                ComplianceRule("MICA-001", RegulatoryFramework.MICA,
                             "Crypto Asset Reporting", 1000, True, 2190, "HIGH")
            ]
        }
    
    def evaluate_compliance(self, transaction: Dict, jurisdiction: List[RegulatoryFramework]) -> Dict:
        """Avalia conformidade regulatória para múltiplas jurisdições"""
        compliance_result = {
            'compliant': True,
            'violations': [],
            'required_reports': [],
            'risk_level': 'LOW',
            'audit_id': self._generate_audit_id()
        }
        
        amount = float(transaction.get('amount', 0))
        
        for framework in jurisdiction:
            if framework in self.rules:
                for rule in self.rules[framework]:
                    violation = self._check_rule_violation(transaction, rule)
                    if violation:
                        compliance_result['compliant'] = False
                        compliance_result['violations'].append(violation)
                        
                        if rule.mandatory_reporting:
                            compliance_result['required_reports'].append({
                                'type': rule.id,
                                'framework': rule.framework.value,
                                'deadline': (datetime.now() + timedelta(hours=24)).isoformat(),
                                'severity': rule.severity
                            })
        
        # Determinar nível de risco geral
        if compliance_result['violations']:
            severities = [v['severity'] for v in compliance_result['violations']]
            if 'CRITICAL' in severities:
                compliance_result['risk_level'] = 'CRITICAL'
            elif 'HIGH' in severities:
                compliance_result['risk_level'] = 'HIGH'
            else:
                compliance_result['risk_level'] = 'MEDIUM'
        
        self._log_audit_event(compliance_result)
        return compliance_result
    
    def _check_rule_violation(self, transaction: Dict, rule: ComplianceRule) -> Optional[Dict]:
        """Verifica violação de regra específica"""
        amount = float(transaction.get('amount', 0))
        
        if amount >= rule.threshold:
            return {
                'rule_id': rule.id,
                'framework': rule.framework.value,
                'description': rule.description,
                'severity': rule.severity,
                'threshold_exceeded': amount - rule.threshold,
                'timestamp': datetime.now().isoformat()
            }
        return None
    
    def _generate_audit_id(self) -> str:
        """Gera ID único para auditoria"""
        timestamp = str(int(time.time()))
        return hashlib.sha256(f"{timestamp}{self._license_key}".encode()).hexdigest()[:16]
    
    def _log_audit_event(self, event: Dict):
        """Registra evento para trilha de auditoria"""
        audit_entry = {
            'timestamp': datetime.now().isoformat(),
            'event_type': 'COMPLIANCE_CHECK',
            'data': event,
            'hash': self._calculate_event_hash(event)
        }
        self._audit_trail.append(audit_entry)
    
    def _calculate_event_hash(self, event: Dict) -> str:
        """Calcula hash do evento para integridade"""
        event_str = json.dumps(event, sort_keys=True)
        return hmac.new(
            self._license_key.encode(),
            event_str.encode(),
            hashlib.sha256
        ).hexdigest()
    
    def generate_compliance_report(self, start_date: datetime, end_date: datetime) -> Dict:
        """Gera relatório de conformidade para período específico"""
        relevant_events = [
            event for event in self._audit_trail
            if start_date <= datetime.fromisoformat(event['timestamp']) <= end_date
        ]
        
        return {
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'total_events': len(relevant_events),
            'violations_count': sum(1 for e in relevant_events if not e['data']['compliant']),
            'compliance_rate': (len(relevant_events) - sum(1 for e in relevant_events if not e['data']['compliant'])) / max(len(relevant_events), 1),
            'events': relevant_events,
            'report_hash': self._calculate_report_hash(relevant_events)
        }
    
    def _calculate_report_hash(self, events: List[Dict]) -> str:
        """Calcula hash do relatório para integridade"""
        events_str = json.dumps(events, sort_keys=True)
        return hashlib.sha256(events_str.encode()).hexdigest()