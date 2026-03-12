import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';

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
    // const phoneNumber = '1234567890'; // Número en formato internacional sin espacios ni símbolos
    // const message = encodeURIComponent('¡Hola! Estoy interesado en tu servicio.');
    // const url = `https://wa.me/${phoneNumber}?text=${message}`;
    //window.open(url, '_blank'); // Abre WhatsApp en una nueva ventana o pestaña

    //await Browser.open({ url: `https://wa.me/message/G456HWLNVCP6C1` });

    await Browser.open({ url: `https://wa.me/message/G456HWLNVCP6C1` });

    //"https://api.whatsapp.com/send?phone=+34671147879&text=Hola,%20estoy%20interesado/a%20en%20tus%20servicios.%20(DesdeWeb)"
  }

}
