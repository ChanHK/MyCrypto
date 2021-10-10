import { Transaction } from './../../source/blockchain';
import { Injectable } from '@angular/core';
import { Blockchain } from '../../source/blockchain';
import * as EC from 'elliptic';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  bcObj = new Blockchain();
  walletKeys: Array<IWalletKey> = [];

  constructor() {
    this.bcObj.difficulty = 1;
    this.bcObj.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

  getBlocks = () => {
    return this.bcObj.chain;
  };

  minePendingTransactions() {
    this.bcObj.minePendingTransactions(this.walletKeys[0].publicKey);
  }

  addressIsFromCurrentUser = (address: string) => {
    return address === this.walletKeys[0].publicKey;
  };

  generateWalletKeys = () => {
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });
  };

  getPendingTransactions = () => {
    return this.bcObj.pendingTransactions;
  };

  addTransaction = (x: Transaction) => {
    this.bcObj.addTransaction(x);
  };
}

export interface IWalletKey {
  keyObj: any;
  publicKey: string;
  privateKey: string;
}
