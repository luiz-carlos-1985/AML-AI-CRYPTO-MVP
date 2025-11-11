import crypto from 'crypto';
import { EventEmitter } from 'events';

interface TransparencyBlock {
  index: number;
  timestamp: number;
  data: TransparencyRecord;
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
}

interface TransparencyRecord {
  type: 'AUDIT' | 'COMPLIANCE' | 'DECISION' | 'ALERT' | 'REPORT';
  entityId: string;
  action: string;
  details: any;
  userId: string;
  ipAddress: string;
  userAgent: string;
  jurisdiction: string;
  complianceScore: number;
  regulatoryFramework: string[];
  publicHash: string; // Hash público para verificação externa
}

interface AuditTrail {
  blockHash: string;
  timestamp: number;
  action: string;
  publicVerificationUrl: string;
  complianceProof: string;
}

class TransparencyBlockchain extends EventEmitter {
  private chain: TransparencyBlock[] = [];
  private pendingRecords: TransparencyRecord[] = [];
  private difficulty = 2; // Dificuldade de mineração
  private miningReward = 0; // Sem recompensa, apenas transparência
  
  constructor() {
    super();
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisRecord: TransparencyRecord = {
      type: 'AUDIT',
      entityId: 'SYSTEM',
      action: 'BLOCKCHAIN_INITIALIZED',
      details: {
        version: '1.0.0',
        complianceFrameworks: ['ISO27001', 'SOC2', 'LGPD', 'FATF'],
        auditStandards: ['ISAE3402', 'SSAE18']
      },
      userId: 'SYSTEM',
      ipAddress: '127.0.0.1',
      userAgent: 'CryptoAML-TransparencyEngine/1.0',
      jurisdiction: 'GLOBAL',
      complianceScore: 100,
      regulatoryFramework: ['GLOBAL_STANDARDS'],
      publicHash: this.generatePublicHash('GENESIS_BLOCK')
    };

    const genesisBlock: TransparencyBlock = {
      index: 0,
      timestamp: Date.now(),
      data: genesisRecord,
      previousHash: '0',
      hash: '',
      nonce: 0,
      merkleRoot: ''
    };

    genesisBlock.merkleRoot = this.calculateMerkleRoot([genesisRecord]);
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
    
    this.emit('genesis-block-created', genesisBlock);
  }

  // Adicionar registro de transparência
  async addTransparencyRecord(record: Omit<TransparencyRecord, 'publicHash'>): Promise<string> {
    const fullRecord: TransparencyRecord = {
      ...record,
      publicHash: this.generatePublicHash(record.entityId + record.action + Date.now())
    };

    this.pendingRecords.push(fullRecord);
    
    // Auto-mineração quando há registros pendentes
    if (this.pendingRecords.length >= 1) {
      await this.mineBlock();
    }

    this.emit('transparency-record-added', fullRecord);
    return fullRecord.publicHash;
  }

  // Mineração de bloco (Proof of Transparency)
  private async mineBlock(): Promise<TransparencyBlock> {
    if (this.pendingRecords.length === 0) {
      throw new Error('No pending records to mine');
    }

    const block: TransparencyBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      data: this.pendingRecords[0], // Um registro por bloco para máxima transparência
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0,
      merkleRoot: ''
    };

    block.merkleRoot = this.calculateMerkleRoot([block.data]);
    
    // Proof of Work para garantir integridade
    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }

    this.chain.push(block);
    this.pendingRecords.shift(); // Remove o registro processado
    
    // Gerar URL pública para verificação
    const publicUrl = await this.generatePublicVerificationUrl(block);
    
    this.emit('block-mined', { block, publicUrl });
    return block;
  }

  // Calcular hash do bloco
  private calculateHash(block: TransparencyBlock): string {
    return crypto
      .createHash('sha256')
      .update(
        block.index +
        block.previousHash +
        block.timestamp +
        JSON.stringify(block.data) +
        block.nonce +
        block.merkleRoot
      )
      .digest('hex');
  }

  // Calcular Merkle Root para integridade dos dados
  private calculateMerkleRoot(records: TransparencyRecord[]): string {
    if (records.length === 0) return '';
    if (records.length === 1) {
      return crypto.createHash('sha256').update(JSON.stringify(records[0])).digest('hex');
    }

    const hashes = records.map(record => 
      crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex')
    );

    while (hashes.length > 1) {
      const newHashes: string[] = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        const combined = crypto.createHash('sha256').update(left + right).digest('hex');
        newHashes.push(combined);
      }
      hashes.splice(0, hashes.length, ...newHashes);
    }

    return hashes[0];
  }

  // Gerar hash público para verificação externa
  private generatePublicHash(data: string): string {
    return crypto.createHash('sha256').update(data + 'CRYPTOAML_TRANSPARENCY').digest('hex').substring(0, 16);
  }

  // Gerar URL pública para verificação de transparência
  private async generatePublicVerificationUrl(block: TransparencyBlock): Promise<string> {
    const verificationData = {
      blockIndex: block.index,
      timestamp: block.timestamp,
      hash: block.hash,
      publicHash: block.data.publicHash,
      complianceScore: block.data.complianceScore,
      jurisdiction: block.data.jurisdiction
    };

    const verificationHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(verificationData))
      .digest('hex');

    return `https://transparency.cryptoaml.com/verify/${verificationHash}`;
  }

  // Validar integridade da blockchain
  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verificar hash do bloco atual
      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      // Verificar ligação com bloco anterior
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Verificar Merkle Root
      const calculatedMerkleRoot = this.calculateMerkleRoot([currentBlock.data]);
      if (currentBlock.merkleRoot !== calculatedMerkleRoot) {
        return false;
      }
    }

    return true;
  }

  // Obter trilha de auditoria completa
  getAuditTrail(entityId?: string): AuditTrail[] {
    return this.chain
      .filter(block => !entityId || block.data.entityId === entityId)
      .map(block => ({
        blockHash: block.hash,
        timestamp: block.timestamp,
        action: block.data.action,
        publicVerificationUrl: `https://transparency.cryptoaml.com/verify/${block.data.publicHash}`,
        complianceProof: this.generateComplianceProof(block)
      }));
  }

  // Gerar prova de compliance
  private generateComplianceProof(block: TransparencyBlock): string {
    const proofData = {
      blockHash: block.hash,
      complianceScore: block.data.complianceScore,
      regulatoryFramework: block.data.regulatoryFramework,
      timestamp: block.timestamp
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(proofData) + 'COMPLIANCE_PROOF')
      .digest('hex');
  }

  // Buscar registros por critérios
  searchRecords(criteria: {
    type?: TransparencyRecord['type'];
    entityId?: string;
    action?: string;
    startDate?: number;
    endDate?: number;
    jurisdiction?: string;
  }): TransparencyBlock[] {
    return this.chain.filter(block => {
      const record = block.data;
      
      if (criteria.type && record.type !== criteria.type) return false;
      if (criteria.entityId && record.entityId !== criteria.entityId) return false;
      if (criteria.action && !record.action.includes(criteria.action)) return false;
      if (criteria.startDate && block.timestamp < criteria.startDate) return false;
      if (criteria.endDate && block.timestamp > criteria.endDate) return false;
      if (criteria.jurisdiction && record.jurisdiction !== criteria.jurisdiction) return false;
      
      return true;
    });
  }

  // Exportar blockchain para auditoria externa
  exportForAudit(): {
    chainLength: number;
    totalRecords: number;
    isValid: boolean;
    genesisHash: string;
    latestHash: string;
    exportTimestamp: number;
    complianceMetrics: any;
  } {
    const complianceMetrics = this.calculateComplianceMetrics();
    
    return {
      chainLength: this.chain.length,
      totalRecords: this.chain.length,
      isValid: this.validateChain(),
      genesisHash: this.chain[0].hash,
      latestHash: this.getLatestBlock().hash,
      exportTimestamp: Date.now(),
      complianceMetrics
    };
  }

  // Calcular métricas de compliance
  private calculateComplianceMetrics(): any {
    const records = this.chain.map(block => block.data);
    
    return {
      averageComplianceScore: records.reduce((sum, r) => sum + r.complianceScore, 0) / records.length,
      recordsByType: records.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      jurisdictionCoverage: [...new Set(records.map(r => r.jurisdiction))],
      regulatoryFrameworks: [...new Set(records.flatMap(r => r.regulatoryFramework))]
    };
  }

  private getLatestBlock(): TransparencyBlock {
    return this.chain[this.chain.length - 1];
  }

  // Método público para obter estatísticas da blockchain
  getBlockchainStats() {
    return {
      totalBlocks: this.chain.length,
      pendingRecords: this.pendingRecords.length,
      isValid: this.validateChain(),
      lastBlockTime: this.getLatestBlock().timestamp,
      difficulty: this.difficulty
    };
  }
}

export const transparencyBlockchain = new TransparencyBlockchain();