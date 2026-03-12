import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/api/card.service';

@Component({
  selector: 'app-tarot-preguntas',
  templateUrl: './tarot-preguntas.page.html',
  styleUrls: ['./tarot-preguntas.page.scss'],
})
export class TarotPreguntasPage implements OnInit {

  cards: ICard[] = [];

  constructor(private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private cardService: CardService) {


  }

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){
    this.cardService.getCardsYesOrNo().subscribe((response: ICard[])=>{
      this.cards = response;
      this.cards = this.cards.map((ele)=>{
        ele.open = false;
        return ele;
      })
    })
  }

  irDetalle() {
    this.navCtrl.navigateForward('/tarot-diario-detalle');
  }



  openMenu() {
    this.menuCtrl.open();
  }

  openCard(c: ICard){

    if(this.countOpen()>=1)
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


  irResultados() {
    const cardOpen: ICard|undefined = this.cards.find((ele)=>ele.open);
    if(cardOpen){
      let navigationExtras: NavigationExtras = {
        state: {
          card: cardOpen,
        }
      };
      //this.navCtrl.navigateForward('/resultados-chatgpt');
      this.router.navigate(["/resultados-chatgpt"], navigationExtras);
    }
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
      }
  }

}
