import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/api/card.service';
import { ResponseYesOrNot } from 'src/app/interfaces/responsegpt.interface';
import { Browser } from '@capacitor/browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VIDEOS_DINERO, VIDEOS_SALUD, VIDEOS_AMOR, VIDEOS_TRABAJO, VideoItem } from 'src/app/data/videos.data';
import { PHONE_NUMBER } from 'src/app/data/constants';


@Component({
  selector: 'app-resultados-chatgpt',
  templateUrl: './resultados-chatgpt.page.html',
  styleUrls: ['./resultados-chatgpt.page.scss'],
})
export class ResultadosChatgptPage implements OnInit, OnDestroy {

  card: ICard|undefined;
  responseConsult: string[] = [];
  loadinfo: boolean = true;
  errorMsg = '';
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
        let state = this.router.getCurrentNavigation()?.extras.state;

        if(state){
          this.card        = state['card'] as unknown as ICard;
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
    this.loadinfo = true;

    const loading = await this.loadingController.create({
      message: 'Interpretando...',
      spinner: 'circles',
    });

    await loading.present();

    if(this.card){
      this.cardService.responseYesOrNo(this.card).pipe(takeUntil(this.destroy$)).subscribe({
        next:(responseYesOrNot: ResponseYesOrNot)=>{
          this.responseConsult = responseYesOrNot.carta_1;
          this.loadinfo        = false;
        },
        complete: async()=>{
          await loading.dismiss();
          this.loadinfo       = false;
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

  trackByIndex(index: number): number {
    return index;
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


  async openYouTubeVideo(url: string) {
    try {
      await Browser.open({ url: url });
    } catch (error) {
      // Failed to open browser
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
