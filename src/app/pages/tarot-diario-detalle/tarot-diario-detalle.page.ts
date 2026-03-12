import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { CardService } from 'src/app/api/card.service';
import { ICard } from 'src/app/interfaces/card.interface';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";


@Component({
  selector: 'app-tarot-diario-detalle',
  templateUrl: './tarot-diario-detalle.page.html',
  styleUrls: ['./tarot-diario-detalle.page.scss'],
})
export class TarotDiarioDetallePage implements OnInit {
  cards: ICard[]  = [];
  subject: string = "";

  constructor(private menuCtrl: MenuController,
    private navCtrl: NavController,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (this.router.getCurrentNavigation()?.extras.state) {
        let state = this.router.getCurrentNavigation()?.extras.state;

        if(state){
          this.subject        = state['subject'] as unknown as string;
          console.log("ESTA ES LA CARTA")
          console.log(this.subject)
        }
      }
    });

   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){
    this.cardService.getCardsGame().subscribe((response: ICard[])=>{
      this.cards = response;
      this.cards = this.cards.map((ele)=>{
        ele.open = false;
        return ele;
      })
    })
  }

  openCard(c: ICard){
    if(this.countOpen()>=3)
      return;

    c.open = true;
  }



  countOpen(){
    let count = 0;
    for(let c of this.cards){
      if(c.open){
        count++;
      }
    }
    return count;
  }

  irDetalle() {
    this.navCtrl.navigateForward('/tarot-diario-detalle');
  }

  irResultados() {

    if(this.countOpen()==3){

      let cardsOpen: ICard[] = []
      for(let c of this.cards){
        if(c.open){
          cardsOpen.push(c)
        }
      }

      let navigationExtras: NavigationExtras = {
        state: {
          subject: this.subject,
          cards: cardsOpen
        }
      };

      //this.navCtrl.navigateForward('/tarot-diario-detalle');
      this.router.navigate(["/resultados"], navigationExtras);

    }
    //this.navCtrl.navigateForward('/resultados');
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
