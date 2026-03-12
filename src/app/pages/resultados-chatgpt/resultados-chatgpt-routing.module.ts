import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadosChatgptPage } from './resultados-chatgpt.page';

const routes: Routes = [
  {
    path: '',
    component: ResultadosChatgptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultadosChatgptPageRoutingModule {}
