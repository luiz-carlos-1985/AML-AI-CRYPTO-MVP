import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: string;
  riskScore: number;
  riskLevel: string;
  flags: string[];
}

interface Wallet {
  id: string;
  address: string;
  blockchain: string;
  riskScore: number;
  transactions: Transaction[];
}

export default function WalletMonitoring() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newWallet, setNewWallet] = useState({ address: '', blockchain: 'bitcoin' });

  const addWallet = async () => {
    try {
      const response = await fetch('/api/monitoring/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet)
      });
      
      if (response.ok) {
        loadWallets();
        setNewWallet({ address: '', blockchain: 'bitcoin' });
      }
    } catch (error) {
      console.error('Erro ao adicionar carteira:', error);
    }
  };

  const loadWallets = async () => {
    try {
      const response = await fetch('/api/monitoring/wallets');
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoramento de Carteiras</h1>
      
      {/* Adicionar Nova Carteira */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Adicionar Carteira</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Endereço da carteira"
            value={newWallet.address}
            onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={newWallet.blockchain}
            onChange={(e) => setNewWallet({...newWallet, blockchain: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
          </select>
          <button
            onClick={addWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Monitorar
          </button>
        </div>
      </div>

      {/* Lista de Carteiras */}
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">{wallet.address}</h3>
                <p className="text-sm text-gray-600">{wallet.blockchain}</p>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-sm ${
                  wallet.riskScore > 70 ? 'bg-red-100 text-red-800' :
                  wallet.riskScore > 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Risco: {wallet.riskScore || 0}
                </div>
              </div>
            </div>

            {/* Transações */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Transações Recentes</h4>
              {wallet.transactions?.length > 0 ? (
                <div className="space-y-2">
                  {wallet.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-mono">{tx.hash.substring(0, 20)}...</p>
                        <p className="text-xs text-gray-600">
                          {tx.fromAddress.substring(0, 10)}... → {tx.toAddress.substring(0, 10)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{tx.amount} {wallet.blockchain === 'bitcoin' ? 'BTC' : 'ETH'}</p>
                        <div className={`text-xs px-1 rounded ${
                          tx.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                          tx.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {tx.riskLevel || 'LOW'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma transação encontrada</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma carteira sendo monitorada. Adicione uma carteira acima.
        </div>
      )}
    </div>
  );
}