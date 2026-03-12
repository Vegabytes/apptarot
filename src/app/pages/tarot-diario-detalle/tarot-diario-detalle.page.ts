import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { CardService } from 'src/app/api/card.service';
import { ICard } from 'src/app/interfaces/card.interface';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-tarot-diario-detalle',
  templateUrl: './tarot-diario-detalle.page.html',
  styleUrls: ['./tarot-diario-detalle.page.scss'],
})
export class TarotDiarioDetallePage implements OnInit, OnDestroy {
  cards: ICard[]  = [];
  subject: string = "";
  errorMsg = '';

  private destroy$ = new Subject<void>();

  constructor(private menuCtrl: MenuController,
    private navCtrl: NavController,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        let state = this.router.getCurrentNavigation()?.extras.state;

        if(state){
          this.subject        = state['subject'] as unknown as string;
        }
      }
    });

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
    this.cardService.getCardsGame().pipe(takeUntil(this.destroy$)).subscribe({
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

      this.router.navigate(["/resultados"], navigationExtras);

    }
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

}
