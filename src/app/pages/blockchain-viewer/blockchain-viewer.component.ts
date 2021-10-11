import { BlockchainService } from '../../services/blockchain.service';
import { Component, OnInit } from '@angular/core';
import { Block } from 'src/app/classes/block.model';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss'],
  providers: [BlockchainService],
})
export class BlockchainViewerComponent implements OnInit {
  public blocks: Array<any> = [];
  public selectedBlock: any = null;

  constructor(private blockchainService: BlockchainService) {
    this.blocks = this.blockchainService.bcObj.chain;
    this.selectedBlock = this.blocks[0];
  }

  ngOnInit(): void {}

  showTransactions(block: Block) {
    this.selectedBlock = block;
    return false;
  }

  blockHasTx = (block: Block) => {
    return block.transactions.length > 0;
  };

  selectedBlockHasTx = () => {
    return this.blockHasTx(this.selectedBlock);
  };

  isSelectedBlock = (block: Block) => {
    return this.selectedBlock === block;
  };

  getBlockNumber = (block: Block) => {
    return this.blocks.indexOf(block) + 1;
  };
}
