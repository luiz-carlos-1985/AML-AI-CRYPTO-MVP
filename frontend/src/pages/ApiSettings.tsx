import React, { useState, useEffect } from 'react';

interface ApiConfig {
  id: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export default function ApiSettings() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [newConfig, setNewConfig] = useState({ provider: 'etherscan', apiKey: '' });

  const providers = [
    { value: 'etherscan', label: 'Etherscan (Ethereum)', url: 'https://etherscan.io/apis' },
    { value: 'blockstream', label: 'Blockstream (Bitcoin)', url: 'https://blockstream.info/api' },
    { value: 'polygonscan', label: 'PolygonScan', url: 'https://polygonscan.com/apis' },
    { value: 'bscscan', label: 'BscScan', url: 'https://bscscan.com/apis' }
  ];

  const loadConfigs = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfigs(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveConfig = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      
      if (response.ok) {
        loadConfigs();
        setNewConfig({ provider: 'etherscan', apiKey: '' });
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const toggleConfig = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/config/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      loadConfigs();
    } catch (error) {
      console.error('Erro ao alterar configuração:', error);
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      await fetch(`/api/config/${id}`, { method: 'DELETE' });
      loadConfigs();
    } catch (error) {
      console.error('Erro ao deletar configuração:', error);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações de API</h1>
      
      {/* Adicionar Nova API */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Adicionar API Key</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Provedor</label>
            <select
              value={newConfig.provider}
              onChange={(e) => setNewConfig({...newConfig, provider: e.target.value})}
              className="w-full p-2 border rounded"
            >
              {providers.map(provider => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              placeholder="Cole sua API key aqui"
              value={newConfig.apiKey}
              onChange={(e) => setNewConfig({...newConfig, apiKey: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Obtenha sua API key em: {providers.find(p => p.value === newConfig.provider)?.url}
            </p>
          </div>
          
          <button
            onClick={saveConfig}
            disabled={!newConfig.apiKey}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Salvar Configuração
          </button>
        </div>
      </div>

      {/* Lista de APIs Configuradas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">APIs Configuradas</h2>
        
        {configs.length > 0 ? (
          <div className="space-y-3">
            {configs.map((config) => (
              <div key={config.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h3 className="font-medium">
                    {providers.find(p => p.value === config.provider)?.label || config.provider}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configurado em {new Date(config.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleConfig(config.id, config.isActive)}
                    className={`px-3 py-1 rounded text-sm ${
                      config.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {config.isActive ? 'Ativo' : 'Inativo'}
                  </button>
                  
                  <button
                    onClick={() => deleteConfig(config.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma API configurada ainda.</p>
        )}
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h3 className="font-semibold text-blue-800 mb-2">Como obter API Keys:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Etherscan:</strong> Registre-se em etherscan.io e vá em "API Keys"</li>
          <li>• <strong>Blockstream:</strong> API gratuita, não requer chave</li>
          <li>• <strong>PolygonScan:</strong> Similar ao Etherscan para Polygon</li>
          <li>• <strong>BscScan:</strong> Para Binance Smart Chain</li>
        </ul>
      </div>
    </div>
  );
}