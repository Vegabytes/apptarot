import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarotHoroscopoPageRoutingModule } from './tarot-horoscopo-routing.module';

import { TarotHoroscopoPage } from './tarot-horoscopo.page';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarotHoroscopoPageRoutingModule
  ],
  declarations: [TarotHoroscopoPage]
})
export class TarotHoroscopoPageModule {}
