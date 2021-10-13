import * as crypto from 'crypto';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export class Transaction {
  private timestamp;
  private signature: string | undefined;
  private _toAddress: string | undefined;
  private _amount: number | undefined;
  private _fromAddress: string | undefined;

  constructor(fromAddress?: string, toAddress?: string, amount?: number) {
    this._fromAddress = fromAddress;
    this._toAddress = toAddress;
    this._amount = amount;
    this.timestamp = Date.now();
  }

  get fromAddress(): string | undefined {
    return this._fromAddress;
  }
  set fromAddress(value: string | undefined) {
    this._fromAddress = value;
  }

  get toAddress(): string | undefined {
    return this._toAddress;
  }
  set toAddress(value: string | undefined) {
    this._toAddress = value;
  }

  get amount(): number | undefined {
    return this._amount;
  }
  set amount(value: number | undefined) {
    this._amount = value;
  }

  calculateHash() {
    if (this._fromAddress === undefined) return undefined;
    else
    return crypto
      .createHash('sha256')
      .update(
        this._fromAddress + this._toAddress + this._amount + this.timestamp
      )
      .digest('hex');
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
    if (this._fromAddress === null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this._fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  };
}
