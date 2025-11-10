# ML Service - Instalação

## Opção 1: Instalar Python e Dependências

```bash
# 1. Instalar Python 3.11+
# Download: https://www.python.org/downloads/

# 2. Instalar dependências
cd ml-service
pip install flask flask-cors numpy scikit-learn joblib

# 3. Rodar serviço
python app.py
```

## Opção 2: Habilitar no Backend

```bash
# .env
ENABLE_ML_SERVICE=true
```

Backend tentará iniciar automaticamente (requer Python instalado).

## Opção 3: Usar sem ML

Sistema funciona sem ML service usando análise baseada em regras.

Apenas não configure `ENABLE_ML_SERVICE=true`.
