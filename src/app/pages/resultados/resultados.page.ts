import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/api/card.service';
import { ResponseCard } from 'src/app/interfaces/responsegpt.interface';
import { Browser } from '@capacitor/browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VIDEOS_DINERO, VIDEOS_SALUD, VIDEOS_AMOR, VIDEOS_TRABAJO, VideoItem } from 'src/app/data/videos.data';


@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnInit, OnDestroy {

  cards: ICard[]        = [];
  subject: string = "";
  responseCard: ResponseCard|undefined;
  loadinfo: boolean = true;
  resumen: string[] = [];
  errorMsg = '';

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
        let state = this.router.getCurrentNavigation()?.extras.state;
        if(state){
          this.subject   = state['subject'] as unknown as string;
          this.cards     = state['cards'] as unknown as ICard[];
        }
      }
    });
  }


  async openYouTubeVideo(url: string) {
    try {
      await Browser.open({ url: url });
    } catch (error) {
      // Failed to open browser
    }
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
        },
        error: async (error)=>{
          await loading.dismiss();
          this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        }
      })
    } else {
      await loading.dismiss();
      this.loadinfo = false;
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

  makeCall(phoneNumber: string) {
    const telUrl = `tel:${phoneNumber}`;
    window.open(telUrl, '_system');
  }


  async irPaginaTarot() {
    this.router.navigate(["/trabajos-personalizados"]);
  }
}
