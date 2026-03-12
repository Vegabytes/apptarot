import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListHoroscopoPage } from './list-horoscopo.page';

const routes: Routes = [
  {
    path: '',
    component: ListHoroscopoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListHoroscopoPageRoutingModule {}
