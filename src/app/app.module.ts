import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockchainViewerComponent } from './pages/blockchain-viewer/blockchain-viewer.component';
import { BlockViewComponent } from './components/block-view/block-view.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from './services/blockchain.service';

@NgModule({
  declarations: [
    AppComponent,
    BlockchainViewerComponent,
    BlockViewComponent,
    TransactionsTableComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [BlockchainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
