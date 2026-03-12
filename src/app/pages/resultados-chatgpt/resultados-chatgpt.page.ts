import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ICard } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/api/card.service';
import { ResponseYesOrNot } from 'src/app/interfaces/responsegpt.interface';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-resultados-chatgpt',
  templateUrl: './resultados-chatgpt.page.html',
  styleUrls: ['./resultados-chatgpt.page.scss'],
})
export class ResultadosChatgptPage implements OnInit {

  card: ICard|undefined;
  responseConsult: string[] = [];
  loadinfo: boolean = true;

  videos = [
    { title: 'RITUAL DE ABUNDANCIA ¡¡ATRAE DINERO Y TRABAJO A TU VIDA!!', url: 'https://youtu.be/Gm5aDjdBKOg' },
    { title: 'HOY TENDRÁS DINERO!! DE INMEDIATO. ES INCREIBLE', url: 'https://youtu.be/AlhwR5RXdv0' },
    { title: 'NO ME CABE TANTO DINERO EN MI CARTERA DESDE QUE HICE ESTO!!!!!', url: 'https://youtu.be/_waE7Gj_wtM' },
    { title: 'PARA QUE TE DE MUCHO DINERO', url: 'https://youtu.be/dz14W44hhN4' },
    { title: 'Una gota AQUÍ atrae DINERO en minutos!!!', url: 'https://youtu.be/QRgcXBMf5Ww' },
  ];

  videossalud = [
    { title: 'PEGA ESTO EN TU VENTANA Y NO TE FALTARÁ DE NADA EN TU VIDA: DINERO, ÉXITO, SALUD', url: 'https://youtu.be/oTtkaJ1Btjo' },
    { title: 'LIMPIEZA CON HUEVO MUY EFECTIVA PARA CONSEGUIR AMARRES DE AMOR PODEROSOS', url: 'https://youtu.be/CrStE2yNmok' },
    { title: 'BAÑO ABRECAMINOS PARA LIMPIAR NUESTRA ENERGÍA💦💦. MUY PURIFICANTE. HAZLO Y ¡¡¡NOTARÁS EL CAMBIO!!', url: 'https://youtu.be/8pHLY5Do5aI' },
    { title: 'CORTA BRUJERÍA, MAL DE OJO, MALA VIBRA, CELOS, ENVIDIA, ENOJOS Y PROTECCIÓN CON AJOS', url: 'https://youtu.be/agoK_gIvRS0' },
    { title: 'LIMPIEZA PARA ATRAER LAS BUENAS ENERGÍAS Y HACER AMARRES EFECTIVOS', url: 'https://youtu.be/rLZ-y3hqsPY' },
  ];

  videosamor = [
    { title: 'Amarre poderoso y efectivo en menos de 2 horas', url: 'https://youtu.be/4TqTtqhKoNs' },
    { title: 'AMARRE POTENTE DE VUDÚ. AMÁRRALO PARA SIEMPRE CON SÓLO SU FOTO', url: 'https://youtu.be/6gsXXRuF0K0' },
    { title: 'AMARRE DE AMOR ETERNO CON PROTECCIÓN PARA QUE NADIE SE ENTROMETA. MUY PODEROSO', url: 'https://youtu.be/CInt8fQqfsw' },
    { title: 'Vuélvelo loco. Amarre extra fuerte para que pierda la cabeza de amor por ti', url: 'https://youtu.be/nbz88N-c9Ps' },
    { title: 'HECHIZO DE AMOR EN 24 HORAS MUY PODEROSO PARA DESESPERARLO', url: 'https://youtu.be/1wzi_qtCA3Q' },
  ];

  videostrabajo = [
    { title: 'RITUAL DE ABUNDANCIA ¡¡ATRAE DINERO Y TRABAJO A TU VIDA!!', url: 'https://youtu.be/Gm5aDjdBKOg' },
    { title: 'AMARRE PARA QUE TE DE DINERO Y TODO LO QUE QUIERAS', url: 'https://youtu.be/G19pbeaoqDo' },
    { title: 'HAZ EL SAQUITO MÁGICO PARA ATRAER CLIENTES, DINERO Y CONSEGUIR TRABAJO. AMULETO-HECHIZO CON ARROZ', url: 'https://youtu.be/7MHr61MSurs' },
    { title: 'ATRAE ABUNDANCIA Y PROSPERIDAD', url: 'https://youtu.be/gLhhd9KvTTI' },
    { title: 'BAÑO ABRECAMINOS PARA LIMPIAR NUESTRA ENERGÍA💦💦. MUY PURIFICANTE. HAZLO Y ¡¡¡NOTARÁS EL CAMBIO!!', url: 'https://youtu.be/8pHLY5Do5aI' },
  ]

  constructor(private menuCtrl: MenuController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private cardService: CardService
  ) {

    console.log("acacakk")

    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (this.router.getCurrentNavigation()?.extras.state) {
        let state = this.router.getCurrentNavigation()?.extras.state;

        if(state){
          this.card        = state['card'] as unknown as ICard;
          console.log("ESTA ES LA CARTA")
          console.log(this.card)
        }
      }
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.initialLoad();
  }

  async initialLoad(){

    this.loadinfo = true;

    const loading = await this.loadingController.create({
      message: 'Interpretando...',
      spinner: 'circles',
    });

    await loading.present();

    if(this.card){
      this.cardService.responseYesOrNo(this.card).subscribe({
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
        }
      })
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
          url: 'https://mariafernandeztarot.com/',
          dialogTitle: 'Compartir'
        });
      } catch (error) {
        console.error('Error al compartir contenido:', error);
      }
  }


  async openYouTubeVideo(url: string) {
    //window.open(url, '_blank'); // Abre el video en una nueva pestaña o ventana
    await Browser.open({ url: url });
  }

  makeCall(phoneNumber: string) {
    const telUrl = `tel:${phoneNumber}`;
    window.open(telUrl, '_system');
  }

  async irPaginaTarot() {
    this.router.navigate(["/trabajos-personalizados"]);
  }

}
