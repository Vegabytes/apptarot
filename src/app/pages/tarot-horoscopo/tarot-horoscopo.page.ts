import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { ZodiacService } from 'src/app/api/zodiac.service';
import { Zodiac } from 'src/app/interfaces/zodiac.interface';
import Swiper from 'swiper';
import { Horoscope } from 'src/app/interfaces/horoscope.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-tarot-horoscopo',
  templateUrl: './tarot-horoscopo.page.html',
  styleUrls: ['./tarot-horoscopo.page.scss'],
})
export class TarotHoroscopoPage implements OnInit {

  zodiacs: Zodiac[] = [];
  @ViewChild('swiper') swiperRef!: ElementRef;
  slidesPerView = 3;
  zodiacActive: number = 0;
  horoscopes: Horoscope[] = [];
  horoscopeActive: Horoscope|undefined;
  sanitizedDescription: SafeHtml = '';
  formattedDate: string = '';


  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private zodiacService: ZodiacService,
    private sanitizer: DomSanitizer) {

      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation()?.extras.state) {
          let state = this.router.getCurrentNavigation()?.extras.state;
          if(state){
            this.horoscopeActive   = state['horoscope'] as unknown as Horoscope|undefined;
            this.formattedDate     = state['formattedDate'] as unknown as string;
            if (this.horoscopeActive) {
              this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(
                this.horoscopeActive.description.replace(/\n/g, '<br>')
              );
            }
          }
        }
      });
  }

  ngOnInit() {

  }

  ionViewDidEnter(){
  }

  async initialLoad(){

    const loading = await this.loadingController.create({
      message: 'Buscando...',
      spinner: 'circles',
    });

    await loading.present();

    this.zodiacService.getZodiacSigns().subscribe((response: Zodiac[])=>{
      this.zodiacs = response;

      this.zodiacService.getHoroscopeAll().subscribe((responseHoroscope: Horoscope[])=>{
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
      })
    })

    await loading.dismiss();

  }

  async buscarTarotActivo(activeId: number){
    this.horoscopeActive = this.horoscopes.find((ele)=>ele.zodiacsign.id===activeId);
    if(this.horoscopeActive){
      this.formattedDate = this.formatDate(this.horoscopeActive.datehoroscope);
      this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(
        this.horoscopeActive.description.replace(/\n/g, '<br>')
      );
    }
  }

  openMenu() {
    this.menuCtrl.open();
  }


  formatDate(inputDate: string): string {
    const [year, month, day] = inputDate.split('-').map(Number);

    // Crea la fecha en la zona horaria local sin interpretar como UTC
    const date = new Date(year, month - 1, day);

    // Opciones para formatear la fecha
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    // Devuelve la fecha en formato español
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  async bntShare() {

    if(this.horoscopeActive){
      try {
        await Share.share({
          title: 'Horoscopo',
          text: `Signo: ${this.horoscopeActive.zodiacsign.name}, Número: ${this.horoscopeActive.numberhoroscope}, Color: ${this.horoscopeActive.color.name}, Lectura: ${this.horoscopeActive.description}`,
          url: 'https://mariafernandeztarot.com/',
          dialogTitle: 'Compartir'
        });
      } catch (error) {
      }
    }

  }
}
