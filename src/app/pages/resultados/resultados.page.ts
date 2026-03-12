import { Component, OnDestroy } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { ResultadosState } from 'src/app/interfaces/navigation-state.interface';
import { CardService } from 'src/app/api/card.service';
import { ResponseCard } from 'src/app/interfaces/responsegpt.interface';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VIDEOS_DINERO, VIDEOS_SALUD, VIDEOS_AMOR, VIDEOS_TRABAJO, VideoItem } from 'src/app/data/videos.data';
import { PHONE_NUMBER, WEBSITE_URL, PHONE_REGEX } from 'src/app/data/constants';


@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnDestroy {

  cards: ICard[]        = [];
  subject: string = "";
  responseCard: ResponseCard|undefined;
  loadinfo: boolean = true;
  resumen: string[] = [];
  errorMsg = '';
  isLoading = false;
  readonly phoneNumber = PHONE_NUMBER;

  videos: VideoItem[] = VIDEOS_DINERO;
  videossalud: VideoItem[] = VIDEOS_SALUD;
  videosamor: VideoItem[] = VIDEOS_AMOR;
  videostrabajo: VideoItem[] = VIDEOS_TRABAJO;

  private destroy$ = new Subject<void>();

  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private cardService: CardService
  ) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        const state = this.router.getCurrentNavigation()?.extras.state as ResultadosState | undefined;
        if(state){
          this.subject   = state.subject;
          this.cards     = state.cards;
        }
      }
    });
  }


  async openYouTubeVideo(url: string) {
    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url });
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      // Failed to open browser
    }
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){
    if (this.isLoading) return;
    this.isLoading = true;

    this.errorMsg = '';

    const loading = await this.loadingController.create({
      message: 'Interpretando...',
      spinner: 'circles',
    });

    await loading.present();

    if(this.subject && this.cards.length==3){

      this.loadinfo = true;

      this.cardService.responseGame(this.subject, this.cards).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: ResponseCard)=>{
          this.responseCard = response;
          this.loadinfo     = false;
          this.resumen      = this.responseCard.resumen;
        },
        complete: async()=>{
          await loading.dismiss();
          this.loadinfo = false;
          this.isLoading = false;
        },
        error: async (_error)=>{
          await loading.dismiss();
          this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
          this.isLoading = false;
        }
      })
    } else {
      await loading.dismiss();
      this.loadinfo = false;
      this.isLoading = false;
      this.errorMsg = 'No se han proporcionado los datos necesarios.';
    }

  }

  retry() {
    this.errorMsg = '';
    this.initialLoad();
  }

  trackByTitle(index: number, item: VideoItem): string {
    return item.title;
  }

  trackByCardId(index: number, item: ICard): number {
    return item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  buscarParrafosTexto(search: string): string[]{
    let textReturn: string[] = [];

    if(this.responseCard){
      if(this.responseCard.carta_1.length > 0){
        let found = this.responseCard.carta_1[0].toLocaleLowerCase().includes(search.toLocaleLowerCase());
        if(found){
          return this.responseCard.carta_1;
        }
      }
      if(this.responseCard.carta_2.length > 0){
        let found = this.responseCard.carta_2[0].toLocaleLowerCase().includes(search.toLocaleLowerCase());
        if(found){
          return this.responseCard.carta_2;
        }
      }
      if(this.responseCard.carta_3.length > 0){
        let found = this.responseCard.carta_3[0].toLocaleLowerCase().includes(search.toLocaleLowerCase());
        if(found){
          return this.responseCard.carta_3;
        }
      }
    }

    return textReturn;
  }

  openMenu() {
    this.menuCtrl.open();
  }


  async bntShare() {

    if(this.responseCard){
      try {
        if (Capacitor.isNativePlatform()) {
          await Share.share({
            title: 'Tarot',
            text: ``,
            url: WEBSITE_URL,
            dialogTitle: 'Compartir'
          });
        } else if (navigator.share) {
          await navigator.share({
            title: 'Tarot',
            text: '',
            url: WEBSITE_URL,
          });
        }
      } catch (error) {
        // Share cancelled by user
      }

    }

  }

  makeCall(phoneNumber: string) {
    if (!PHONE_REGEX.test(phoneNumber)) return;
    window.open(`tel:${phoneNumber}`, '_system');
  }


  async irPaginaTarot() {
    this.router.navigate(["/trabajos-personalizados"]);
  }
}
