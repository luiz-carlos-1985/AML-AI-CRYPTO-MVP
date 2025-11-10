from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

app = Flask(__name__)
CORS(app)

# Simple ML model for AML risk detection
class AMLRiskModel:
    def __init__(self):
        self.model = None
        self.load_or_train_model()
    
    def load_or_train_model(self):
        model_path = 'aml_model.pkl'
        
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            # Train simple model with synthetic data
            X_train = np.random.rand(1000, 5)  # 5 features
            y_train = (X_train[:, 0] * 100 > 50).astype(int)  # Simple rule
            
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.model.fit(X_train, y_train)
            joblib.dump(self.model, model_path)
    
    def extract_features(self, transaction):
        """Extract features from transaction"""
        amount = float(transaction.get('amount', 0))
        
        # Feature engineering
        features = [
            amount / 10000,  # Normalized amount
            1 if amount > 10000 else 0,  # High value flag
            1 if amount % 1000 == 0 else 0,  # Round number flag
            len(transaction.get('fromAddress', '')),  # Address complexity
            len(transaction.get('flags', []))  # Existing flags count
        ]
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, transaction):
        features = self.extract_features(transaction)
        risk_prob = self.model.predict_proba(features)[0][1]
        
        # Calculate risk score (0-100)
        risk_score = int(risk_prob * 100)
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'CRITICAL'
        elif risk_score >= 50:
            risk_level = 'HIGH'
        elif risk_score >= 30:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        # Generate flags
        flags = []
        amount = float(transaction.get('amount', 0))
        
        if amount > 50000:
            flags.append('HIGH_VALUE')
        if amount > 10000:
            flags.append('MEDIUM_VALUE')
        if amount % 1000 == 0:
            flags.append('ROUND_AMOUNT')
        if risk_prob > 0.7:
            flags.append('ML_HIGH_RISK')
        
        return {
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'flags': flags,
            'confidence': float(risk_prob)
        }

model = AMLRiskModel()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-aml'})

@app.route('/analyze/transaction', methods=['POST'])
def analyze_transaction():
    try:
        data = request.json
        result = model.predict(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze/wallet', methods=['POST'])
def analyze_wallet():
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        if not transactions:
            return jsonify({
                'riskScore': 0,
                'riskLevel': 'LOW',
                'flags': []
            })
        
        # Analyze all transactions
        scores = []
        all_flags = set()
        
        for tx in transactions:
            result = model.predict(tx)
            scores.append(result['riskScore'])
            all_flags.update(result['flags'])
        
        # Aggregate risk
        avg_score = int(np.mean(scores))
        max_score = int(np.max(scores))
        
        # Wallet risk is weighted average
        wallet_risk = int(avg_score * 0.6 + max_score * 0.4)
        
        if wallet_risk >= 70:
            risk_level = 'CRITICAL'
        elif wallet_risk >= 50:
            risk_level = 'HIGH'
        elif wallet_risk >= 30:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        return jsonify({
            'riskScore': wallet_risk,
            'riskLevel': risk_level,
            'flags': list(all_flags)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('🤖 ML Service starting...')
    print('📊 Model loaded and ready')
    app.run(host='0.0.0.0', port=8000, debug=False)
