import { Component, OnDestroy } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { ResultadosChatgptState } from 'src/app/interfaces/navigation-state.interface';
import { CardService } from 'src/app/api/card.service';
import { ResponseYesOrNot } from 'src/app/interfaces/responsegpt.interface';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VIDEOS_DINERO, VIDEOS_SALUD, VIDEOS_AMOR, VIDEOS_TRABAJO, VideoItem } from 'src/app/data/videos.data';
import { PHONE_NUMBER, WEBSITE_URL, PHONE_REGEX } from 'src/app/data/constants';


@Component({
  selector: 'app-resultados-chatgpt',
  templateUrl: './resultados-chatgpt.page.html',
  styleUrls: ['./resultados-chatgpt.page.scss'],
})
export class ResultadosChatgptPage implements OnDestroy {

  card: ICard|undefined;
  responseConsult: string[] = [];
  loadinfo: boolean = true;
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
        const state = this.router.getCurrentNavigation()?.extras.state as ResultadosChatgptState | undefined;

        if(state){
          this.card        = state.card;
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
    if (this.isLoading) return;
    this.isLoading = true;

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

  trackByIndex(index: number): number {
    return index;
  }

  openMenu() {
    this.menuCtrl.open();
  }

  async bntShare() {
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

  makeCall(phoneNumber: string) {
    if (!PHONE_REGEX.test(phoneNumber)) return;
    window.open(`tel:${phoneNumber}`, '_system');
  }

  async irPaginaTarot() {
    this.router.navigate(["/trabajos-personalizados"]);
  }

}
