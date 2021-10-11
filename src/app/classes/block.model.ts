import { Transaction } from './transaction.model';
import * as crypto from 'crypto';

export class Block {
  private nonce: number;
  private _hash: string;
  private timestamp: number;
  public transactions: Array<Transaction>;
  private _previousHash: string;

  constructor(
    timestamp: number,
    transactions: Array<Transaction>,
    previousHash: string = ''
  ) {
    this._previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this._hash = this.calculateHash();
  }

  get hash(): string {
    return this._hash;
  }
  set hash(value: string) {
    this._hash = value;
  }

  get previousHash(): string {
    return this._previousHash;
  }
  set previousHash(value: string) {
    this._previousHash = value;
  }

  calculateHash = () => {
    return crypto
      .createHash('sha256')
      .update(
        this._previousHash +
          this.timestamp.toString() +
          JSON.stringify(this.transactions) +
          this.nonce
      )
      .digest('hex');
  };

  mineBlock = (difficulty: number) => {
    while (
      this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this._hash = this.calculateHash();
    }

    console.log('Block mined: ' + this._hash);
  };

  hasValidTransactions() {
    for (const x of this.transactions) {
      if (!x.isValid()) return false;
    }
    return true;
  }
}
