import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from "@angular/router";
import { TarotDiarioDetalleState } from 'src/app/interfaces/navigation-state.interface';
import { WEBSITE_URL } from 'src/app/data/constants';

@Component({
  selector: 'app-tarot-diario',
  templateUrl: './tarot-diario.page.html',
  styleUrls: ['./tarot-diario.page.scss'],

})
export class TarotDiarioPage {

  constructor(private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController) {}

  irDetalle(subject: string) {

    const navState: TarotDiarioDetalleState = {
      subject: subject,
    };
    let navigationExtras: NavigationExtras = {
      state: navState,
    };

    //this.navCtrl.navigateForward('/tarot-diario-detalle');
    this.router.navigate(["/tarot-diario-detalle"], navigationExtras);
  }


  openMenu() {
    this.menuCtrl.open();
  }

  async bntShare() {
      try {
        await Share.share({
          title: 'Tarot',
          text: ``,
          url: WEBSITE_URL,
          dialogTitle: 'Compartir'
        });
      } catch (error) {
        // Share cancelled by user
      }
  }

}
