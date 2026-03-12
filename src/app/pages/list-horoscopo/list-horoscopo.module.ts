import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListHoroscopoPageRoutingModule } from './list-horoscopo-routing.module';

import { ListHoroscopoPage } from './list-horoscopo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListHoroscopoPageRoutingModule
  ],
  declarations: [ListHoroscopoPage]
})
export class ListHoroscopoPageModule {}
