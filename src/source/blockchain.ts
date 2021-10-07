const cryptoo = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

export class Transaction {
    public timestamp
    public signature?: string 
    constructor(public toAddress: string, public amount: number, public fromAddress?: string) {
        this.fromAddress = fromAddress; 
        this.toAddress = toAddress; 
        this.amount = amount; 
        this.timestamp = Date.now();
    }

    calculateHash() {
        return cryptoo
        .createHash("sha256")
        .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
        .digest("hex");
    }

    signTransaction(key: any) {
        if (key.getPublic("hex") !== this.fromAddress) {
            throw new Error("You cannot sign transactions for other wallets!");
        }

        //create digital signature
        const hash = this.calculateHash();
        const sig = key.sign(hash, "base64");

        this.signature = sig.toDER("hex");
    }

  isValid() {
    if (this.fromAddress === null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export class Block {
    public nonce: number
    public hash: string
    constructor(public timestamp: number,public transactions: Array<any>, public previousHash: String = "") {
        this.previousHash = previousHash; //string
        this.timestamp = timestamp;
        this.transactions = transactions; //Transaction[]
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return cryptoo
        .createHash("sha256")
        .update(
            this.previousHash +
            this.timestamp.toString() +
            JSON.stringify(this.transactions) +
            this.nonce
        )
        .digest("hex");
    }

    mineBlock(difficulty:number) {
        while (
        this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
        this.nonce++;
        this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

    hasValidTransactions() {
        for (const x of this.transactions) if (!x.isValid()) return false;
        return true;
    }
}

export class Blockchain {
    public chain: Array<Block>
    public difficulty:number
    public pendingTransactions: Array<any>
    public miningReward: number
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
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
        throw new Error("Invalid From or To address");
        if (!t.isValid())
        throw new Error("Cannot add invalid transaction to chain");
        if (t.amount <= 0) throw new Error("Amount is invalid");
        if (this.calAddressBalance(t.fromAddress) < t.amount)
        throw new Error("Invalid balance");
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

