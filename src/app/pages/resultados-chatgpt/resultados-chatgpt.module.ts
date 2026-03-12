import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultadosChatgptPageRoutingModule } from './resultados-chatgpt-routing.module';

import { ResultadosChatgptPage } from './resultados-chatgpt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadosChatgptPageRoutingModule
  ],
  declarations: [ResultadosChatgptPage]
})
export class ResultadosChatgptPageModule {}
