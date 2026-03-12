import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { ZodiacService } from 'src/app/api/zodiac.service';
import { Zodiac } from 'src/app/interfaces/zodiac.interface';
import Swiper from 'swiper';
import { Horoscope } from 'src/app/interfaces/horoscope.interface';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-tarot-horoscopo',
  templateUrl: './tarot-horoscopo.page.html',
  styleUrls: ['./tarot-horoscopo.page.scss'],
})
export class TarotHoroscopoPage implements OnInit {

  zodiacs: Zodiac[] = [];
  @ViewChild('swiper') swiperRef!: ElementRef;
  slidesPerView = 3; // Número de slides visibles
  zodiacActive: number = 0;
  horoscopes: Horoscope[] = [];
  horoscopeActive: Horoscope|undefined;
  formattedDate: string = '';


  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private zodiacService: ZodiacService) {

      this.route.queryParams.subscribe(params => {
        console.log(params)
        if (this.router.getCurrentNavigation()?.extras.state) {
          let state = this.router.getCurrentNavigation()?.extras.state;
          if(state){
            this.horoscopeActive   = state['horoscope'] as unknown as Horoscope|undefined;
            this.formattedDate     = state['formattedDate'] as unknown as string;
          }
        }
      });
  }

  ngOnInit() {

  }

  ionViewDidEnter(){
    //this.initialLoad();
  }

  async initialLoad(){

    const loading = await this.loadingController.create({
      message: 'Buscando...',
      spinner: 'circles',
    });

    await loading.present();

    this.zodiacService.getZodiacSigns().subscribe((response: Zodiac[])=>{
      this.zodiacs = response;
      console.log("ZODIACSSSSSS")
      console.log(this.zodiacs)
      console.log("ZODIACSSSSSS")

      this.zodiacService.getHoroscopeAll().subscribe((responseHoroscope: Horoscope[])=>{
        this.horoscopes = responseHoroscope;

        for(const h of this.horoscopes){
          h.description = h.description.replace(/\n/g, '<br>');
        }
        // Calcular el índice central en la carga inicial
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

  // ngAfterViewInit() {
  //   const swiper = this.swiperRef.nativeElement.swiper;
  //   // Agrega el evento de cambio de slide
  //   // swiper.on('slideChange', (e: any) => {

  //   //   console.log("ENTROAAAA")
  //   //   let swiperSlides = swiper.slides;
  //   //   for(let s of swiperSlides){
  //   //     if(s.className.includes("swiper-slide-next")){
  //   //       console.log(s.className);
  //   //       console.log(s.innerText);
  //   //       console.log(s.id);
  //   //       this.zodiacs.forEach((z, index) => z.active = (z.id === parseInt(s.id)));

  //   //       //this.buscarTarot();
  //   //     }
  //   //   }
  //   // });

  //   swiper.on('transitionEnd', () => {
  //     console.log("Transición completada");

  //     // Obtener los slides
  //     let swiperSlides = swiper.slides;

  //     // Recorrer los slides para encontrar el que tiene la clase `swiper-slide-next`
  //     for (let s of swiperSlides) {
  //       if (s.className.includes("swiper-slide-next")) {
  //         console.log("Clase encontrada:", s.className);
  //         console.log("Texto interno:", s.innerText);
  //         console.log("ID del slide:", s.id);

  //         // Actualizar tu lógica
  //         this.zodiacs.forEach((z, index) => z.active = (z.id === parseInt(s.id)));

  //         // Llamar a tu método
  //         this.buscarTarotActivo(parseInt(s.id));

  //       }
  //     }
  //   });

  // }

  async buscarTarotActivo(activeId: number){
    this.horoscopeActive = this.horoscopes.find((ele)=>ele.zodiacsign.id===activeId);
    if(this.horoscopeActive){
      this.formattedDate = this.formatDate(this.horoscopeActive.datehoroscope);
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
        console.error('Error al compartir contenido:', error);
      }
    }

  }
}
