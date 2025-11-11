import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { revolutionaryApi, QuantumComplianceResult } from '../services/revolutionaryApi';
import { useTranslation } from 'react-i18next';

const QuantumCompliance: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuantumComplianceResult | null>(null);
  const [formData, setFormData] = useState({
    transactionAmount: '',
    fromAddress: '',
    toAddress: '',
    jurisdiction: 'BR'
  });

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await revolutionaryApi.analyzeQuantumCompliance({
        transactionData: {
          amount: parseFloat(formData.transactionAmount),
          fromAddress: formData.fromAddress,
          toAddress: formData.toAddress,
          timestamp: Date.now()
        },
        userProfile: {
          kycLevel: 'ENHANCED',
          previousViolations: 0,
          complianceTraining: true
        },
        jurisdiction: formData.jurisdiction
      });
      setResult(response.quantumAnalysis);
    } catch (error) {
      console.error('Quantum analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'MINIMAL': return 'text-green-400';
      case 'LOW': return 'text-blue-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
          🧠
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Quantum Compliance Analysis</h2>
          <p className="text-purple-200">AI-powered multi-dimensional risk assessment</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white/70 text-sm mb-2">Transaction Amount</label>
          <input
            type="number"
            value={formData.transactionAmount}
            onChange={(e) => setFormData({ ...formData, transactionAmount: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">Jurisdiction</label>
          <select
            value={formData.jurisdiction}
            onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="BR">Brazil (LGPD, BACEN)</option>
            <option value="US">United States (BSA)</option>
            <option value="EU">European Union (GDPR)</option>
            <option value="GLOBAL">Global (FATF)</option>
          </select>
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">From Address</label>
          <input
            type="text"
            value={formData.fromAddress}
            onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">To Address</label>
          <input
            type="text"
            value={formData.toAddress}
            onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            placeholder="0x..."
          />
        </div>
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading || !formData.transactionAmount}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Running Quantum Analysis...
          </div>
        ) : (
          '🧠 Run Quantum Analysis'
        )}
      </button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          {/* Risk Level */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70">Quantum Risk Level:</span>
              <span className={`font-bold text-lg ${getRiskColor(result.quantumRiskLevel)}`}>
                {result.quantumRiskLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Compliance Score:</span>
              <span className="text-white font-bold text-lg">{result.complianceScore.toFixed(1)}/100</span>
            </div>
          </div>

          {/* Regulatory Alignment */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Regulatory Alignment</h3>
            <div className="space-y-2">
              {Object.entries(result.regulatoryAlignment).map(([framework, score]) => (
                <div key={framework} className="flex items-center justify-between">
                  <span className="text-white/70">{framework}:</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-white/10 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{score.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Insights */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Predictive Insights</h3>
            <div className="space-y-2">
              {result.predictiveInsights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-white/80 text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Future Risk Prediction */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Future Risk Prediction:</span>
              <span className="text-yellow-400 font-bold">{result.futureRiskPrediction.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white/70">Quantum Fingerprint:</span>
              <span className="text-purple-400 font-mono text-sm">{result.quantumFingerprint}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuantumCompliance;