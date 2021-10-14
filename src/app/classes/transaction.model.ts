import { SHA256 } from 'crypto-js';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export class Transaction {
  private timestamp;
  private signature: string | undefined;
  private _toAddress: string;
  private _amount: number;
  private _fromAddress: string;

  constructor(
    fromAddress: string = '',
    toAddress: string = '',
    amount: number = 100
  ) {
    this._fromAddress = fromAddress;
    this._toAddress = toAddress;
    this._amount = amount;
    this.timestamp = Date.now();
  }

  get fromAddress(): string {
    return this._fromAddress;
  }
  set fromAddress(value: string) {
    this._fromAddress = value;
  }

  get toAddress(): string {
    return this._toAddress;
  }
  set toAddress(value: string) {
    this._toAddress = value;
  }

  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = value;
  }

  calculateHash() {
    return SHA256(
      this._fromAddress + this._toAddress + this._amount + this.timestamp
    ).toString();
  }

  signTransaction = (key: any) => {
    if (key.getPublic('hex') !== this._fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    //create digital signature
    const hash = this.calculateHash();
    const sig = key.sign(hash, 'base64');

    this.signature = sig.toDER('hex');
  };

  isValid = () => {
    if (this._fromAddress === '') return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this._fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  };
}
