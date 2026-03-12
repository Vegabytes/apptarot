import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoroscopoDetailsPageRoutingModule } from './horoscopo-details-routing.module';

import { HoroscopoDetailsPage } from './horoscopo-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoroscopoDetailsPageRoutingModule
  ],
  declarations: [HoroscopoDetailsPage]
})
export class HoroscopoDetailsPageModule {}
