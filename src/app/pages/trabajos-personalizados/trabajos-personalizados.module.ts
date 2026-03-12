import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajosPersonalizadosPageRoutingModule } from './trabajos-personalizados-routing.module';

import { TrabajosPersonalizadosPage } from './trabajos-personalizados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajosPersonalizadosPageRoutingModule
  ],
  declarations: [TrabajosPersonalizadosPage]
})
export class TrabajosPersonalizadosPageModule {}
