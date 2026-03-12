import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarotDiarioPage } from './tarot-diario.page';

const routes: Routes = [
  {
    path: '',
    component: TarotDiarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarotDiarioPageRoutingModule {}
