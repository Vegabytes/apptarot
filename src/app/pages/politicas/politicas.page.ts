import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})
export class PoliticasPage {

  constructor(private menuCtrl: MenuController, ) { }

  openMenu() {
    this.menuCtrl.open();
  }


}
