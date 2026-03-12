import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { WHATSAPP_ID } from 'src/app/data/constants';

@Component({
  selector: 'app-trabajos-personalizados',
  templateUrl: './trabajos-personalizados.page.html',
  styleUrls: ['./trabajos-personalizados.page.scss'],
})
export class TrabajosPersonalizadosPage implements OnInit {

  constructor( private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  openMenu() {
    this.menuCtrl.open();
  }

  async bntShare() {
      try {
        await Share.share({
          title: 'Tarot',
          text: ``,
          url: 'https://mariafernandeztarot.com/',
          dialogTitle: 'Compartir'
        });
      } catch (error) {
        // Share cancelled by user
      }
  }

  async openWhatsApp() {
    await Browser.open({ url: `https://wa.me/message/${WHATSAPP_ID}` });
  }

}
