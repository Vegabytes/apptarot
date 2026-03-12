import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
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
        if (Capacitor.isNativePlatform()) {
          await Share.share({
            title: 'Tarot',
            text: ``,
            url: 'https://mariafernandeztarot.com/',
            dialogTitle: 'Compartir'
          });
        } else if (navigator.share) {
          await navigator.share({
            title: 'Tarot',
            text: '',
            url: 'https://mariafernandeztarot.com/',
          });
        }
      } catch (error) {
        // Share cancelled by user
      }
  }

  async openWhatsApp() {
    const url = `https://wa.me/message/${WHATSAPP_ID}`;
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

}
