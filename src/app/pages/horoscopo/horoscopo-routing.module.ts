import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoroscopoPage } from './horoscopo.page';

const routes: Routes = [
  {
    path: '',
    component: HoroscopoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoroscopoPageRoutingModule {}
