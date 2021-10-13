import { Transaction } from './transaction.model';
import * as crypto from 'crypto';
import { SHA256 } from 'crypto-js';

export class Block {
  private _nonce: number;
  private _hash: string;
  private _timestamp: number;
  public transactions: Array<Transaction>;
  private _previousHash: string;

  constructor(
    timestamp: number,
    transactions: Array<Transaction>,
    previousHash: string = ''
  ) {
    this._previousHash = previousHash;
    this._timestamp = timestamp;
    this.transactions = transactions;
    this._nonce = 0;
    this._hash = this.calculateHash();
  }

  get hash(): string {
    return this._hash;
  }
  set hash(value: string) {
    this._hash = value;
  }

  get timestamp(): number {
    return this._timestamp;
  }
  set timestamp(value: number) {
    this._timestamp = value;
  }

  get nonce(): number {
    return this._nonce;
  }
  set nonce(value: number) {
    this._nonce = value;
  }

  get previousHash(): string {
    return this._previousHash;
  }
  set previousHash(value: string) {
    this._previousHash = value;
  }

  calculateHash = () => {
    // return crypto
    //   .createHash('sha256')
    //   .update(
    //     this._previousHash +
    //       this._timestamp.toString() +
    //       JSON.stringify(this.transactions) +
    //       this._nonce
    //   )
    //   .digest('hex');
    return SHA256(
      this._previousHash +
        this._timestamp.toString() +
        JSON.stringify(this.transactions) +
        this._nonce
    ).toString();
  };

  mineBlock = (difficulty: number) => {
    while (
      this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this._nonce++;
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
