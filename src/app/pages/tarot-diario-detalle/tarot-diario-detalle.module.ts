import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarotDiarioDetallePageRoutingModule } from './tarot-diario-detalle-routing.module';

import { TarotDiarioDetallePage } from './tarot-diario-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarotDiarioDetallePageRoutingModule
  ],
  declarations: [TarotDiarioDetallePage]
})
export class TarotDiarioDetallePageModule {}
