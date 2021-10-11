import { Block } from './block.model';
import { Transaction } from './transaction.model';

export class Blockchain {
  private chain: Array<Block>;
  private difficulty: number;
  private pendingTransactions: Array<any>;
  private miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  minePendingTransactions = (address: string) => {
    const reward = new Transaction(address, this.miningReward); // fromaddress is null
    this.pendingTransactions.push(reward);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.chain[this.chain.length - 1].hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = []; //clear pending transactions
  };

  addTransaction = (transaction: Transaction) => {
    this.validateTransaction(transaction);
    this.pendingTransactions.push(transaction);
  };

  validateTransaction = (t: Transaction) => {
    if (!t.fromAddress || !t.toAddress)
      throw new Error('Invalid From or To address');
    if (!t.isValid())
      throw new Error('Cannot add invalid transaction to chain');
    if (t.amount <= 0) throw new Error('Amount is invalid');
    if (this.calAddressBalance(t.fromAddress) < t.amount)
      throw new Error('Invalid balance');
  };

  calAddressBalance = (address: string) => {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) balance -= trans.amount;
        if (trans.toAddress === address) balance += trans.amount;
      }
    }
    return balance;
  };

  getAllTransactions = (address: string) => {
    const temp = [];

    for (const block of this.chain) {
      for (const x of block.transactions) {
        if (x.fromAddress === address || x.toAddress === address) {
          temp.push(x);
        }
      }
    }
    // returns all transactions of this -> address
    return temp;
  };

  isChainValid() {
    //genesis check
    const realGenesis = JSON.stringify(this.createGenesisBlock());
    if (realGenesis !== JSON.stringify(this.chain[0])) return false;

    //remaining block check
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) return false;
      if (!currentBlock.hasValidTransactions()) return false;
      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
    }

    return true;
  }
}
