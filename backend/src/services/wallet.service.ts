import { ethers } from 'ethers';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

export class WalletService {
  // Gerar nova wallet com seed phrase
  static generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  }

  // Importar wallet via seed phrase
  static importFromMnemonic(mnemonic: string, index: number = 0) {
    const wallet = ethers.Wallet.fromPhrase(mnemonic, `m/44'/60'/0'/0/${index}`);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic
    };
  }

  // Importar wallet via chave privada
  static importFromPrivateKey(privateKey: string) {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }

  // Criptografar dados sensíveis
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // Descriptografar dados sensíveis
  static decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Obter balance
  static async getBalance(address: string, rpcUrl: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch {
      return '0.0';
    }
  }

  // Assinar transação
  static async signTransaction(privateKey: string, tx: any) {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signTransaction(tx);
  }
}
