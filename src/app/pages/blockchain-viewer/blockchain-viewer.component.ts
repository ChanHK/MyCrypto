import { BlockchainService } from './../../services/blockchain.service';
import { Component, OnInit } from '@angular/core';
import { Block } from 'src/source/blockchain';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss'],
})
export class BlockchainViewerComponent implements OnInit {
  public blocks: any = [];
  public selectedBlock: any = null;

  constructor(private blockchainService: BlockchainService) {
    this.blocks = blockchainService.getBlocks();
    this.selectedBlock = this.blocks[0];
  }

  ngOnInit(): void {}

  showTransactions(block: any) {
    this.selectedBlock = block;
  }
}
