import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})
export class PoliticasPage implements OnInit {

  constructor(private menuCtrl: MenuController, ) { }

  ngOnInit() {
  }

  openMenu() {
    this.menuCtrl.open();
  }


}
