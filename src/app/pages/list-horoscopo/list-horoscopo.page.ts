import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Horoscope } from 'src/app/interfaces/horoscope.interface';
import { Zodiac } from 'src/app/interfaces/zodiac.interface';
import { ZodiacService } from 'src/app/api/zodiac.service';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-list-horoscopo',
  templateUrl: './list-horoscopo.page.html',
  styleUrls: ['./list-horoscopo.page.scss'],
})
export class ListHoroscopoPage implements OnInit {

  zodiacs: Zodiac[] = [];
  zodiacActive: number = 0;
  horoscopes: Horoscope[] = [];
  horoscopeActive: Horoscope|undefined;
  formattedDate: string = '';
  loadinfo: boolean = true;

  constructor(private navCtrl: NavController,
      private menuCtrl: MenuController,
      private loadingController: LoadingController,
      private router: Router,
      private zodiacService: ZodiacService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){

    this.loadinfo = true;

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
      this.loadinfo = false;

      this.zodiacService.getHoroscopeAll().subscribe((responseHoroscope: Horoscope[])=>{
        this.horoscopes = responseHoroscope;
        for(const h of this.horoscopes){
          h.description = h.description.replace(/\n/g, '<br>');
        }
      })

    })

    await loading.dismiss();
    this.loadinfo = false;

  }

  async buscarTarotActivo(activeId: number){
    this.horoscopeActive = this.horoscopes.find((ele)=>ele.zodiacsign.id===activeId);
    if(this.horoscopeActive){
      this.formattedDate = this.formatDate(this.horoscopeActive.datehoroscope);
    }

    let navigationExtras: NavigationExtras = {
      state: {
        horoscope: this.horoscopeActive,
        formattedDate: this.formattedDate
      }
    };


    this.router.navigate(["/tarot-horoscopo"], navigationExtras);
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

  irDetalleHoroscopo() {

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
      console.error('Error al compartir contenido:', error);
    }
  }

  makeCall(phoneNumber: string) {
    const telUrl = `tel:${phoneNumber}`;
    window.open(telUrl, '_system');
  }


}
