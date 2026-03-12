import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/api/card.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tarot-preguntas',
  templateUrl: './tarot-preguntas.page.html',
  styleUrls: ['./tarot-preguntas.page.scss'],
})
export class TarotPreguntasPage implements OnInit, OnDestroy {

  cards: ICard[] = [];
  errorMsg = '';

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private cardService: CardService) {


  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){
    this.errorMsg = '';
    this.cardService.getCardsYesOrNo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: ICard[])=>{
        this.cards = response;
        this.cards = this.cards.map((ele)=>{
          ele.open = false;
          return ele;
        })
      },
      error: (error) => {
        this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      }
    })
  }

  retry() {
    this.errorMsg = '';
    this.initialLoad();
  }

  trackByCardId(index: number, item: ICard): number {
    return item.id;
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
        // Share cancelled by user
      }
  }

}
