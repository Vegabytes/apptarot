import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarotDiarioPageRoutingModule } from './tarot-diario-routing.module';

import { TarotDiarioPage } from './tarot-diario.page';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarotDiarioPageRoutingModule
  ],
  declarations: [TarotDiarioPage],
 

})
export class TarotDiarioPageModule {}
