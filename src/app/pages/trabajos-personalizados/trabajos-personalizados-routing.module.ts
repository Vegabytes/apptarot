import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrabajosPersonalizadosPage } from './trabajos-personalizados.page';

const routes: Routes = [
  {
    path: '',
    component: TrabajosPersonalizadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrabajosPersonalizadosPageRoutingModule {}
