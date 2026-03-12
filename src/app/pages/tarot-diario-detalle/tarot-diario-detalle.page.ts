import { Component, OnDestroy } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { CardService } from 'src/app/api/card.service';
import { ICard } from 'src/app/interfaces/card.interface';
import { ResultadosState, TarotDiarioDetalleState } from 'src/app/interfaces/navigation-state.interface';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WEBSITE_URL } from 'src/app/data/constants';


@Component({
  selector: 'app-tarot-diario-detalle',
  templateUrl: './tarot-diario-detalle.page.html',
  styleUrls: ['./tarot-diario-detalle.page.scss'],
})
export class TarotDiarioDetallePage implements OnDestroy {
  cards: ICard[]  = [];
  subject: string = "";
  errorMsg = '';

  private destroy$ = new Subject<void>();

  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        const state = this.router.getCurrentNavigation()?.extras.state as TarotDiarioDetalleState | undefined;

        if(state){
          this.subject        = state.subject;
        }
      }
    });

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

    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });

    await loading.present();

    this.cardService.getCardsGame().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: ICard[])=>{
        this.cards = response;
        this.cards = this.cards.map((ele)=>{
          ele.open = false;
          return ele;
        })
      },
      complete: async () => {
        await loading.dismiss();
      },
      error: async (_error) => {
        await loading.dismiss();
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

      const navState: ResultadosState = {
        subject: this.subject,
        cards: cardsOpen,
      };
      let navigationExtras: NavigationExtras = {
        state: navState,
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
          url: WEBSITE_URL,
          dialogTitle: 'Compartir'
        });
      } catch (error) {
        // Share cancelled by user
      }
  }

}
