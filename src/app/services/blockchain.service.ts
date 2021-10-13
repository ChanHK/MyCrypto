import { Injectable } from '@angular/core';
import * as EC from 'elliptic';
import { Block } from '../classes/block.model';
import { Blockchain } from '../classes/blockchain.model';
import { Transaction } from '../classes/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  public bcObj = new Blockchain();
  public walletKeys: Array<IWalletKey> = [];

  constructor() {
    this.bcObj.difficulty = 1;
    this.bcObj.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

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
