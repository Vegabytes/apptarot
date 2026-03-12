import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarotDiarioDetallePage } from './tarot-diario-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: TarotDiarioDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarotDiarioDetallePageRoutingModule {}
