import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { ZodiacService } from 'src/app/api/zodiac.service';
import { Zodiac } from 'src/app/interfaces/zodiac.interface';
import { Horoscope, Sign } from 'src/app/interfaces/horoscope.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-tarot-horoscopo',
  templateUrl: './tarot-horoscopo.page.html',
  styleUrls: ['./tarot-horoscopo.page.scss'],
})
export class TarotHoroscopoPage implements OnInit, OnDestroy {

  zodiacs: Zodiac[] = [];
  slidesPerView = 3;
  zodiacActive: number = 0;
  horoscopes: Horoscope[] = [];
  horoscopeActive: Horoscope|undefined;
  sanitizedDescription: SafeHtml = '';
  formattedDate: string = '';
  errorMsg = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private zodiacService: ZodiacService,
    private sanitizer: DomSanitizer) {

      this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
        if (this.router.getCurrentNavigation()?.extras.state) {
          let state = this.router.getCurrentNavigation()?.extras.state;
          if(state){
            this.horoscopeActive   = state['horoscope'] as unknown as Horoscope|undefined;
            this.formattedDate     = state['formattedDate'] as unknown as string;
            if (this.horoscopeActive) {
              this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(
                this.horoscopeActive?.description ? this.horoscopeActive.description.replace(/\n/g, '<br>') : ''
              );
            }
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
    if (this.horoscopeActive === undefined) {
      this.initialLoad();
    }
  }

  async initialLoad(){
    if (this.isLoading) return;
    this.isLoading = true;

    this.errorMsg = '';

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
            const centralIndex = Math.floor(this.slidesPerView / 2);
            if (this.zodiacs.length > centralIndex) {
              this.zodiacs.forEach((z, index) => {
                z.active = index === centralIndex
                if(index===centralIndex){
                  this.buscarTarotActivo(z.id);
                }
              });
            }
          },
          complete: async () => {
            await loading.dismiss();
            this.isLoading = false;
          },
          error: async (error) => {
            await loading.dismiss();
            this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
            this.isLoading = false;
          }
        })
      },
      error: async (error) => {
        await loading.dismiss();
        this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    })

  }

  retry() {
    this.errorMsg = '';
    this.initialLoad();
  }

  trackBySignId(index: number, item: Sign): number {
    return item.id;
  }

  async buscarTarotActivo(activeId: number){
    this.horoscopeActive = this.horoscopes.find((ele)=>ele.zodiacsign.id===activeId);
    if(this.horoscopeActive){
      this.formattedDate = this.formatDate(this.horoscopeActive.datehoroscope);
      this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(
        this.horoscopeActive?.description ? this.horoscopeActive.description.replace(/\n/g, '<br>') : ''
      );
    }
  }

  openMenu() {
    this.menuCtrl.open();
  }


  formatDate(inputDate: string): string {
    const [year, month, day] = inputDate.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  async bntShare() {

    if(this.horoscopeActive){
      try {
        if (Capacitor.isNativePlatform()) {
          await Share.share({
            title: 'Horoscopo',
            text: `Signo: ${this.horoscopeActive.zodiacsign.name}, Número: ${this.horoscopeActive.numberhoroscope}, Color: ${this.horoscopeActive.color.name}, Lectura: ${this.horoscopeActive.description}`,
            url: 'https://mariafernandeztarot.com/',
            dialogTitle: 'Compartir'
          });
        } else if (navigator.share) {
          await navigator.share({
            title: 'Horoscopo',
            text: `Signo: ${this.horoscopeActive.zodiacsign.name}, Número: ${this.horoscopeActive.numberhoroscope}, Color: ${this.horoscopeActive.color.name}, Lectura: ${this.horoscopeActive.description}`,
            url: 'https://mariafernandeztarot.com/',
          });
        }
      } catch (error) {
        // Share cancelled by user
      }
    }

  }
}
