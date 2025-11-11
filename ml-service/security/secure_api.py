"""
API Segura com Certificações Internacionais
Implementa controles de segurança para ISO 27001, SOC 2, PCI DSS
"""

import jwt
import bcrypt
import secrets
import time
import hashlib
import hmac
from functools import wraps
from flask import request, jsonify, g
from typing import Dict, List, Optional, Callable
import redis
import logging
from datetime import datetime, timedelta
import re

class SecureAPIManager:
    """Gerenciador de API segura com controles de certificação"""
    
    def __init__(self, redis_client=None):
        self.redis_client = redis_client or redis.Redis(decode_responses=True)
        self.jwt_secret = secrets.token_urlsafe(32)
        self.rate_limit_window = 3600  # 1 hora
        self.max_requests_per_hour = 1000
        self.failed_login_threshold = 5
        self.account_lockout_duration = 1800  # 30 minutos
        
    def generate_secure_token(self, user_id: str, permissions: List[str]) -> str:
        """Gera token JWT seguro"""
        payload = {
            'user_id': user_id,
            'permissions': permissions,
            'iat': int(time.time()),
            'exp': int(time.time()) + 3600,  # 1 hora
            'jti': secrets.token_urlsafe(16)  # JWT ID único
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
    def validate_token(self, token: str) -> Optional[Dict]:
        """Valida token JWT"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            
            # Verificar se token não foi revogado
            if self.redis_client.get(f"revoked_token:{payload['jti']}"):
                return None
            
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def revoke_token(self, token: str):
        """Revoga token JWT"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'], options={"verify_exp": False})
            jti = payload.get('jti')
            if jti:
                # Armazenar token revogado até expiração
                exp = payload.get('exp', int(time.time()))
                ttl = max(0, exp - int(time.time()))
                self.redis_client.setex(f"revoked_token:{jti}", ttl, "1")
        except:
            pass
    
    def hash_password(self, password: str) -> str:
        """Hash seguro de senha com bcrypt"""
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verifica senha com hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def validate_password_strength(self, password: str) -> Dict[str, bool]:
        """Valida força da senha (ISO 27001 compliance)"""
        checks = {
            'min_length': len(password) >= 12,
            'has_uppercase': bool(re.search(r'[A-Z]', password)),
            'has_lowercase': bool(re.search(r'[a-z]', password)),
            'has_digit': bool(re.search(r'\d', password)),
            'has_special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password)),
            'no_common_patterns': not self._check_common_patterns(password)
        }
        
        checks['is_strong'] = all(checks.values())
        return checks
    
    def _check_common_patterns(self, password: str) -> bool:
        """Verifica padrões comuns fracos"""
        common_patterns = [
            r'123456', r'password', r'qwerty', r'admin',
            r'(.)\1{3,}',  # Repetição de caracteres
            r'(012|123|234|345|456|567|678|789|890)',  # Sequências
        ]
        
        password_lower = password.lower()
        return any(re.search(pattern, password_lower) for pattern in common_patterns)
    
    def rate_limit_check(self, identifier: str, limit: int = None, window: int = None) -> bool:
        """Rate limiting (SOC 2 compliance)"""
        limit = limit or self.max_requests_per_hour
        window = window or self.rate_limit_window
        
        key = f"rate_limit:{identifier}"
        current = self.redis_client.get(key)
        
        if current is None:
            self.redis_client.setex(key, window, 1)
            return True
        
        if int(current) >= limit:
            return False
        
        self.redis_client.incr(key)
        return True
    
    def track_failed_login(self, identifier: str) -> bool:
        """Rastreia tentativas de login falhadas"""
        key = f"failed_login:{identifier}"
        current = self.redis_client.get(key)
        
        if current is None:
            self.redis_client.setex(key, self.account_lockout_duration, 1)
            return True
        
        failed_count = int(current)
        if failed_count >= self.failed_login_threshold:
            return False  # Conta bloqueada
        
        self.redis_client.incr(key)
        return True
    
    def reset_failed_login(self, identifier: str):
        """Reset contador de login falhado após sucesso"""
        self.redis_client.delete(f"failed_login:{identifier}")
    
    def log_security_event(self, event_type: str, user_id: str, details: Dict):
        """Log de eventos de segurança (auditoria)"""
        event = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': user_id,
            'ip_address': request.remote_addr if request else 'unknown',
            'user_agent': request.headers.get('User-Agent', 'unknown') if request else 'unknown',
            'details': details
        }
        
        # Log estruturado para SIEM
        logging.info(f"SECURITY_EVENT: {event}")
        
        # Armazenar no Redis para análise
        event_key = f"security_event:{int(time.time())}:{secrets.token_urlsafe(8)}"
        self.redis_client.setex(event_key, 86400 * 30, str(event))  # 30 dias
    
    def validate_input_sanitization(self, data: Dict) -> Dict[str, List[str]]:
        """Validação e sanitização de entrada (OWASP compliance)"""
        errors = {}
        
        for key, value in data.items():
            field_errors = []
            
            if isinstance(value, str):
                # Verificar injeção SQL
                if self._check_sql_injection(value):
                    field_errors.append("Possible SQL injection detected")
                
                # Verificar XSS
                if self._check_xss(value):
                    field_errors.append("Possible XSS payload detected")
                
                # Verificar command injection
                if self._check_command_injection(value):
                    field_errors.append("Possible command injection detected")
            
            if field_errors:
                errors[key] = field_errors
        
        return errors
    
    def _check_sql_injection(self, value: str) -> bool:
        """Detecta possível injeção SQL"""
        sql_patterns = [
            r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)",
            r"(\b(OR|AND)\s+\d+\s*=\s*\d+)",
            r"(--|#|/\*|\*/)",
            r"(\bUNION\s+SELECT\b)",
            r"(\'\s*(OR|AND)\s*\'\w*\'\s*=\s*\'\w*\')"
        ]
        
        value_upper = value.upper()
        return any(re.search(pattern, value_upper, re.IGNORECASE) for pattern in sql_patterns)
    
    def _check_xss(self, value: str) -> bool:
        """Detecta possível XSS"""
        xss_patterns = [
            r"<script[^>]*>.*?</script>",
            r"javascript:",
            r"on\w+\s*=",
            r"<iframe[^>]*>",
            r"<object[^>]*>",
            r"<embed[^>]*>"
        ]
        
        return any(re.search(pattern, value, re.IGNORECASE) for pattern in xss_patterns)
    
    def _check_command_injection(self, value: str) -> bool:
        """Detecta possível injeção de comando"""
        cmd_patterns = [
            r"[;&|`$(){}[\]\\]",
            r"\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)\b",
            r"(&&|\|\|)",
            r"(\$\(|\`)"
        ]
        
        return any(re.search(pattern, value, re.IGNORECASE) for pattern in cmd_patterns)
    
    def generate_csrf_token(self, session_id: str) -> str:
        """Gera token CSRF"""
        timestamp = str(int(time.time()))
        message = f"{session_id}:{timestamp}"
        signature = hmac.new(
            self.jwt_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return f"{timestamp}:{signature}"
    
    def validate_csrf_token(self, token: str, session_id: str, max_age: int = 3600) -> bool:
        """Valida token CSRF"""
        try:
            timestamp_str, signature = token.split(':', 1)
            timestamp = int(timestamp_str)
            
            # Verificar idade do token
            if time.time() - timestamp > max_age:
                return False
            
            # Verificar assinatura
            message = f"{session_id}:{timestamp_str}"
            expected_signature = hmac.new(
                self.jwt_secret.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        
        except (ValueError, TypeError):
            return False

# Decoradores de segurança

def require_auth(permissions: List[str] = None):
    """Decorator para autenticação obrigatória"""
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Authentication required'}), 401
            
            token = auth_header.split(' ')[1]
            secure_api = SecureAPIManager()
            payload = secure_api.validate_token(token)
            
            if not payload:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            # Verificar permissões
            if permissions:
                user_permissions = payload.get('permissions', [])
                if not any(perm in user_permissions for perm in permissions):
                    return jsonify({'error': 'Insufficient permissions'}), 403
            
            g.current_user = payload
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def rate_limit(limit: int = 100, window: int = 3600):
    """Decorator para rate limiting"""
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            identifier = request.remote_addr
            if hasattr(g, 'current_user'):
                identifier = g.current_user.get('user_id', identifier)
            
            secure_api = SecureAPIManager()
            if not secure_api.rate_limit_check(identifier, limit, window):
                return jsonify({'error': 'Rate limit exceeded'}), 429
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def validate_input():
    """Decorator para validação de entrada"""
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.is_json:
                secure_api = SecureAPIManager()
                errors = secure_api.validate_input_sanitization(request.json)
                
                if errors:
                    return jsonify({'error': 'Input validation failed', 'details': errors}), 400
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def require_csrf():
    """Decorator para proteção CSRF"""
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            csrf_token = request.headers.get('X-CSRF-Token')
            session_id = request.headers.get('X-Session-ID')
            
            if not csrf_token or not session_id:
                return jsonify({'error': 'CSRF token required'}), 400
            
            secure_api = SecureAPIManager()
            if not secure_api.validate_csrf_token(csrf_token, session_id):
                return jsonify({'error': 'Invalid CSRF token'}), 400
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def security_headers():
    """Decorator para adicionar headers de segurança"""
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = f(*args, **kwargs)
            
            # Adicionar headers de segurança
            if hasattr(response, 'headers'):
                response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
                response.headers['X-Content-Type-Options'] = 'nosniff'
                response.headers['X-Frame-Options'] = 'DENY'
                response.headers['X-XSS-Protection'] = '1; mode=block'
                response.headers['Content-Security-Policy'] = "default-src 'self'"
                response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
            
            return response
        
        return decorated_function
    return decorator