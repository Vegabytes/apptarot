import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarotHoroscopoPage } from './tarot-horoscopo.page';

const routes: Routes = [
  {
    path: '',
    component: TarotHoroscopoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarotHoroscopoPageRoutingModule {}
