import { Component, OnInit } from '@angular/core';
import { BlockchainService } from './services/blockchain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'MyCrypto';
  public blockchain;
  public showInfoMessage = true;

  constructor(private blockchainService: BlockchainService) {
    this.blockchain = blockchainService.blockchainInstance;
  }

  ngOnInit(): void {}

  thereArePendingTransactions() {
    return this.blockchain.pendingTransactions.length > 0;
  }

  dismissInfoMessage() {
    this.showInfoMessage = false;
  }
}
