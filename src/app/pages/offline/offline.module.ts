import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { OfflinePageRoutingModule } from './offline-routing.module';
import { OfflinePage } from './offline.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    OfflinePageRoutingModule
  ],
  declarations: [OfflinePage]
})
export class OfflinePageModule {}
