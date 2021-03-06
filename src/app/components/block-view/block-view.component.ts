import { Component, Input, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.scss'],
})
export class BlockViewComponent implements OnInit {
  @Input()
  public block: any;

  @Input()
  public selectedBlock: any;

  private blocksInChain;

  constructor(private blockchainService: BlockchainService) {
    this.blocksInChain = blockchainService.bcObj.chain;
  }

  ngOnInit(): void {}

  blockHasTx() {
    return this.block.transactions.length > 0;
  }

  isSelectedBlock() {
    return this.block === this.selectedBlock;
  }

  getBlockNumber() {
    return this.blocksInChain.indexOf(this.block) + 1;
  }
}
