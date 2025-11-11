"""
Sistema Anti-Tampering e Proteção Intelectual
Implementa múltiplas camadas de proteção contra cópia e engenharia reversa
"""

import hashlib
import hmac
import os
import sys
import time
import psutil
import platform
from typing import Dict, List, Optional
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import json

class AntiTamperingSystem:
    """Sistema de proteção contra tampering e cópia não autorizada"""
    
    def __init__(self):
        self._hardware_fingerprint = self._generate_hardware_fingerprint()
        self._code_integrity_hashes = self._calculate_code_integrity()
        self._runtime_checks_active = True
        self._obfuscation_key = self._derive_obfuscation_key()
        
    def _generate_hardware_fingerprint(self) -> str:
        """Gera fingerprint único do hardware"""
        components = []
        
        try:
            # CPU info
            components.append(platform.processor())
            
            # Memória total
            components.append(str(psutil.virtual_memory().total))
            
            # Informações do sistema
            components.append(platform.system())
            components.append(platform.machine())
            
            # MAC address da primeira interface de rede
            import uuid
            components.append(str(uuid.getnode()))
            
        except Exception:
            # Fallback para informações básicas
            components = [platform.system(), platform.machine(), str(time.time())]
        
        fingerprint_data = "|".join(components)
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()
    
    def _calculate_code_integrity(self) -> Dict[str, str]:
        """Calcula hashes de integridade dos arquivos críticos"""
        critical_files = [
            'app.py',
            'risk_analyzer.py',
            'compliance/regulatory_engine.py',
            'advanced_ml/graph_neural_network.py'
        ]
        
        integrity_hashes = {}
        
        for file_path in critical_files:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'rb') as f:
                        file_content = f.read()
                        file_hash = hashlib.sha256(file_content).hexdigest()
                        integrity_hashes[file_path] = file_hash
            except Exception:
                pass
        
        return integrity_hashes
    
    def _derive_obfuscation_key(self) -> bytes:
        """Deriva chave de ofuscação baseada no hardware"""
        password = self._hardware_fingerprint.encode()
        salt = b'aml_crypto_salt_2024'
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        return base64.urlsafe_b64encode(kdf.derive(password))
    
    def validate_execution_environment(self) -> Dict[str, bool]:
        """Valida ambiente de execução para detectar debugging/análise"""
        checks = {
            'debugger_detected': self._detect_debugger(),
            'vm_detected': self._detect_virtual_machine(),
            'code_integrity_valid': self._verify_code_integrity(),
            'hardware_fingerprint_valid': self._verify_hardware_fingerprint(),
            'execution_time_normal': self._check_execution_timing()
        }
        
        return checks
    
    def _detect_debugger(self) -> bool:
        """Detecta presença de debugger"""
        try:
            # Verificar se está sendo executado em modo debug
            if sys.gettrace() is not None:
                return True
            
            # Verificar processos suspeitos
            suspicious_processes = [
                'gdb', 'lldb', 'windbg', 'x64dbg', 'ida', 'ghidra',
                'ollydbg', 'immunity', 'cheat engine'
            ]
            
            for proc in psutil.process_iter(['name']):
                try:
                    if any(susp in proc.info['name'].lower() 
                          for susp in suspicious_processes):
                        return True
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return False
            
        except Exception:
            return False
    
    def _detect_virtual_machine(self) -> bool:
        """Detecta execução em máquina virtual"""
        try:
            vm_indicators = [
                'vmware', 'virtualbox', 'qemu', 'xen', 'hyper-v',
                'parallels', 'kvm', 'bochs'
            ]
            
            system_info = platform.system().lower()
            processor_info = platform.processor().lower()
            
            return any(indicator in system_info or indicator in processor_info 
                      for indicator in vm_indicators)
            
        except Exception:
            return False
    
    def _verify_code_integrity(self) -> bool:
        """Verifica integridade dos arquivos de código"""
        current_hashes = self._calculate_code_integrity()
        
        for file_path, expected_hash in self._code_integrity_hashes.items():
            if file_path in current_hashes:
                if current_hashes[file_path] != expected_hash:
                    return False
            else:
                return False
        
        return True
    
    def _verify_hardware_fingerprint(self) -> bool:
        """Verifica se o fingerprint do hardware não mudou"""
        current_fingerprint = self._generate_hardware_fingerprint()
        return current_fingerprint == self._hardware_fingerprint
    
    def _check_execution_timing(self) -> bool:
        """Verifica timing de execução para detectar análise"""
        start_time = time.time()
        
        # Operação que deve levar tempo consistente
        dummy_calculation = sum(i * i for i in range(10000))
        
        execution_time = time.time() - start_time
        
        # Se a execução for muito lenta, pode indicar debugging
        return execution_time < 0.1
    
    def obfuscate_sensitive_data(self, data: str) -> str:
        """Ofusca dados sensíveis usando criptografia"""
        try:
            fernet = Fernet(self._obfuscation_key)
            encrypted_data = fernet.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
        except Exception:
            return data
    
    def deobfuscate_sensitive_data(self, obfuscated_data: str) -> str:
        """Desofusca dados sensíveis"""
        try:
            fernet = Fernet(self._obfuscation_key)
            encrypted_data = base64.urlsafe_b64decode(obfuscated_data.encode())
            decrypted_data = fernet.decrypt(encrypted_data)
            return decrypted_data.decode()
        except Exception:
            return obfuscated_data
    
    def generate_license_challenge(self) -> Dict[str, str]:
        """Gera desafio de licença baseado no hardware"""
        timestamp = str(int(time.time()))
        challenge_data = f"{self._hardware_fingerprint}:{timestamp}"
        
        challenge_hash = hmac.new(
            self._obfuscation_key,
            challenge_data.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return {
            'challenge': challenge_hash,
            'timestamp': timestamp,
            'fingerprint_partial': self._hardware_fingerprint[:8]
        }
    
    def validate_license_response(self, response: str, challenge: Dict[str, str]) -> bool:
        """Valida resposta do desafio de licença"""
        try:
            expected_response = hmac.new(
                self._obfuscation_key,
                f"{challenge['challenge']}:validated".encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(response, expected_response)
        except Exception:
            return False
    
    def runtime_protection_check(self) -> bool:
        """Verificação de proteção em tempo de execução"""
        if not self._runtime_checks_active:
            return False
        
        environment_checks = self.validate_execution_environment()
        
        # Se qualquer verificação falhar, o sistema está comprometido
        critical_checks = [
            'code_integrity_valid',
            'hardware_fingerprint_valid'
        ]
        
        for check in critical_checks:
            if not environment_checks.get(check, False):
                self._trigger_protection_response()
                return False
        
        return True
    
    def _trigger_protection_response(self):
        """Resposta de proteção quando tampering é detectado"""
        # Desativar funcionalidades críticas
        self._runtime_checks_active = False
        
        # Limpar dados sensíveis da memória
        self._obfuscation_key = b'0' * 32
        self._hardware_fingerprint = '0' * 64
        
        # Log do evento (sem expor detalhes)
        print("Security violation detected. System protection activated.")
    
    def get_system_status(self) -> Dict:
        """Retorna status do sistema de proteção"""
        return {
            'protection_active': self._runtime_checks_active,
            'hardware_bound': bool(self._hardware_fingerprint),
            'code_integrity_monitored': bool(self._code_integrity_hashes),
            'last_check': time.time()
        }

class CodeObfuscator:
    """Ofuscador de código para proteção adicional"""
    
    @staticmethod
    def obfuscate_string(text: str, key: str) -> str:
        """Ofusca string usando XOR com chave"""
        key_bytes = key.encode()
        result = []
        
        for i, char in enumerate(text):
            key_char = key_bytes[i % len(key_bytes)]
            obfuscated_char = ord(char) ^ key_char
            result.append(chr(obfuscated_char))
        
        return ''.join(result)
    
    @staticmethod
    def create_dummy_functions():
        """Cria funções dummy para confundir análise estática"""
        def dummy_ml_function():
            import random
            return [random.random() for _ in range(100)]
        
        def dummy_crypto_function():
            return hashlib.sha256(b'dummy').hexdigest()
        
        def dummy_network_function():
            return {'status': 'connected', 'latency': 42}
        
        # Executar funções dummy ocasionalmente
        if time.time() % 10 < 1:
            dummy_ml_function()
            dummy_crypto_function()
            dummy_network_function()

# Instância global do sistema de proteção
_protection_system = AntiTamperingSystem()

def get_protection_system() -> AntiTamperingSystem:
    """Retorna instância do sistema de proteção"""
    return _protection_system