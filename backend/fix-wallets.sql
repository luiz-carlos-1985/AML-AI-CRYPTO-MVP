-- Corrigir wallets com endereços Ethereum marcados como Bitcoin
UPDATE "Wallet"
SET blockchain = 'ETHEREUM'
WHERE address LIKE '0x%' AND blockchain = 'BITCOIN';

-- Verificar resultado
SELECT id, address, blockchain FROM "Wallet";
