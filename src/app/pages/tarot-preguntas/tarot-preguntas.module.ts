import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarotPreguntasPageRoutingModule } from './tarot-preguntas-routing.module';

import { TarotPreguntasPage } from './tarot-preguntas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarotPreguntasPageRoutingModule
  ],
  declarations: [TarotPreguntasPage]
})
export class TarotPreguntasPageModule {}
