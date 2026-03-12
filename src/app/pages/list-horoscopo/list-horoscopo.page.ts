import { Component, OnDestroy } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Horoscope } from 'src/app/interfaces/horoscope.interface';
import { TarotHoroscopoState } from 'src/app/interfaces/navigation-state.interface';
import { Zodiac } from 'src/app/interfaces/zodiac.interface';
import { ZodiacService } from 'src/app/api/zodiac.service';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PHONE_NUMBER, WEBSITE_URL, PHONE_REGEX } from 'src/app/data/constants';


@Component({
  selector: 'app-list-horoscopo',
  templateUrl: './list-horoscopo.page.html',
  styleUrls: ['./list-horoscopo.page.scss'],
})
export class ListHoroscopoPage implements OnDestroy {

  zodiacs: Zodiac[] = [];
  zodiacActive: number = 0;
  horoscopes: Horoscope[] = [];
  horoscopeActive: Horoscope|undefined;
  formattedDate: string = '';
  loadinfo: boolean = true;
  errorMsg = '';
  isLoading = false;
  readonly phoneNumber = PHONE_NUMBER;

  private destroy$ = new Subject<void>();

  constructor(private navCtrl: NavController,
      private menuCtrl: MenuController,
      private loadingController: LoadingController,
      private router: Router,
      private zodiacService: ZodiacService) { }

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
      message: 'Buscando...',
      spinner: 'circles',
    });

    await loading.present();

    this.zodiacService.getZodiacSigns().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: Zodiac[])=>{
        this.zodiacs = response;

        this.zodiacService.getHoroscopeAll().pipe(takeUntil(this.destroy$)).subscribe({
          next: (responseHoroscope: Horoscope[])=>{
            this.horoscopes = responseHoroscope;
            for(const h of this.horoscopes){
              h.description = h.description.replace(/\n/g, '<br>');
            }
          },
          complete: async () => {
            await loading.dismiss();
            this.loadinfo = false;
            this.isLoading = false;
          },
          error: async (_error) => {
            await loading.dismiss();
            this.loadinfo = false;
            this.isLoading = false;
            this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
          }
        })
      },
      error: async (_error) => {
        await loading.dismiss();
        this.loadinfo = false;
        this.isLoading = false;
        this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      }
    })

  }

  retry() {
    this.errorMsg = '';
    this.initialLoad();
  }

  trackByZodiacId(index: number, item: Zodiac): number {
    return item.id;
  }

  async buscarTarotActivo(activeId: number){
    this.horoscopeActive = this.horoscopes.find((ele)=>ele.zodiacsign.id===activeId);
    if(this.horoscopeActive){
      this.formattedDate = this.formatDate(this.horoscopeActive.datehoroscope);
    }

    const navState: TarotHoroscopoState = {
      horoscope: this.horoscopeActive,
      formattedDate: this.formattedDate,
    };
    let navigationExtras: NavigationExtras = {
      state: navState,
    };


    this.router.navigate(["/tarot-horoscopo"], navigationExtras);
  }

  formatDate(inputDate: string): string {
    if (!inputDate) return '';
    const [year, month, day] = inputDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
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

  makeCall(phoneNumber: string) {
    if (!PHONE_REGEX.test(phoneNumber)) return;
    window.open(`tel:${phoneNumber}`, '_system');
  }


}
