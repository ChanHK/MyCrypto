import { Injectable } from '@angular/core';
import * as EC from 'elliptic';
import { Block } from '../classes/block.model';
import { Blockchain } from '../classes/blockchain.model';
import { Transaction } from '../classes/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  public bcObj = {
    // minePendingTransactions: Function,
    // addTransaction: [Function],
    // validateTransaction: Function,
    // calAddressBalance: Function,
    // getAllTransactions: Function,
    chain: [
      {
        previousHash: '0',
        timestamp: 1633959735019,
        transactions: [],
        nonce: 0,
        hash: '90e7fb044286d5a90d61e6ab9ad6ed6ddb19124fe176e99b04425c3e4ea257c3',
      },
      {
        previousHash:
          '90e7fb044286d5a90d61e6ab9ad6ed6ddb19124fe176e99b04425c3e4ea257c3',
        timestamp: 1633959735020,
        transactions: [Array],
        nonce: 803,
        hash: '00b3516751ece06999210deabf36326b2e301439652159555d72187f67d130df',
      },
      {
        previousHash:
          '00b3516751ece06999210deabf36326b2e301439652159555d72187f67d130df',
        timestamp: 1633959735085,
        transactions: [Array],
        nonce: 190,
        hash: '00c4996b2a8a4416229e75f9f9eaa1721a91ccd0a1042151f1c994ff1eb1275c',
      },
    ],
    difficulty: 2,
    pendingTransactions: [
      {
        fromAddress:
          '04ace7625d17e04adf8c5c1eea953d27e888156dc2078d520935b0ad10be8844f7b27ac6c7283309df01b4658e430112b183369dd4742140d56cbe06153a3c2956',
        toAddress: 'address2',
        amount: 100,
        timestamp: 1633959735089,
        signature:
          '3046022100d70a91a4a61094dce989856b7c008d7887f99e626c81b09e061205f4965b83ad02210093f9c70e8de501c6ac11ef59cba66f0e263bf0fa7aadb68d7ec74653d81675fd',
      },
    ],
    miningReward: 100,
  };
  public walletKeys: Array<IWalletKey> = [];

  constructor() {
    this.bcObj.difficulty = 1;
    // this.bcObj.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

  minePendingTransactions() {
    // this.bcObj.minePendingTransactions(this.walletKeys[0].publicKey);
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
    // this.bcObj.addTransaction(x);
  };
}

export interface IWalletKey {
  keyObj: any;
  publicKey: string;
  privateKey: string;
}
