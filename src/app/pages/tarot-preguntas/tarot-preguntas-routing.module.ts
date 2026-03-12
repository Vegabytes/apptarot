import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarotPreguntasPage } from './tarot-preguntas.page';

const routes: Routes = [
  {
    path: '',
    component: TarotPreguntasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarotPreguntasPageRoutingModule {}
