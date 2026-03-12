import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from "@angular/router";
import { CardService } from 'src/app/api/card.service';
import { ICard } from 'src/app/interfaces/card.interface';

@Component({
  selector: 'app-tarot-diario',
  templateUrl: './tarot-diario.page.html',
  styleUrls: ['./tarot-diario.page.scss'],

})
export class TarotDiarioPage implements OnInit {

  cards: ICard[] = [];

  constructor(private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private cardService: CardService) {}

  ngOnInit() {

  }


  irDetalle(subject: string) {

    let navigationExtras: NavigationExtras = {
      state: {
        subject: subject,
      }
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
          url: 'https://mariafernandeztarot.com/',
          dialogTitle: 'Compartir'
        });
      } catch (error) {
        console.error('Error al compartir contenido:', error);
      }
  }

}
