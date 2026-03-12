import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoroscopoDetailsPage } from './horoscopo-details.page';

const routes: Routes = [
  {
    path: '',
    component: HoroscopoDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoroscopoDetailsPageRoutingModule {}
