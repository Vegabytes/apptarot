import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private navCtrl: NavController, private menuCtrl: MenuController ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Deshabilita el menú lateral en esta vista
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Habilita el menú lateral cuando sales de esta vista
    this.menuCtrl.enable(true);
  }

  irDetalleTarotDiario() {
    this.navCtrl.navigateForward('/tarot-diario');
  }

  irDetalleTarotPregunta() {
    this.navCtrl.navigateForward('/tarot-preguntas');
  }

  irHoroscopo() {
    this.navCtrl.navigateForward('/list-horoscopo');
  }

  irTrabajoPersonalizados() {
    this.navCtrl.navigateForward('/trabajos-personalizados');
  }

  async irRituales() {
   // const url = `https://youtube.com/@mariafernandezfernandez?si=30702DI8DZDg3REw`;
   // window.open(url, '_blank'); // Abre el enlace en una nueva pestaña o ventana

    await Browser.open({ url: `https://youtube.com/@mariafernandezfernandez?si=30702DI8DZDg3REw` });
  }

}
