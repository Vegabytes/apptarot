import { Component, NgZone } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { NavController, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Device } from '@capacitor/device';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { SafeArea } from 'capacitor-plugin-safe-area';
import { StatusBar, Style } from '@capacitor/status-bar';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installPromptShown = false;
  private iosInstallShown = false;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private location: Location,
    private router: Router,
    private ngZone: NgZone,
    private toastController: ToastController,
    private titleService: Title,
    private metaService: Meta,
  ) {
    this.initializeApp();
    this.listenNetwork();
    this.listenInstallPrompt();
    this.showIOSInstallBanner();
    this.listenRouteChanges();
  }

  private listenRouteChanges() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.router.routerState.root.firstChild?.snapshot.data;
      if (routeData?.['title']) {
        this.titleService.setTitle(routeData['title']);
      }
      if (routeData?.['description']) {
        this.metaService.updateTag({ name: 'description', content: routeData['description'] });
        this.metaService.updateTag({ property: 'og:description', content: routeData['description'] });
      }
      const announcer = document.getElementById('route-announcer');
      if (announcer) {
        announcer.textContent = document.title;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (Capacitor.isNativePlatform()) {
        this.handleBackButton();
      }

      if (Capacitor.getPlatform() === 'android'){
        await this.fixAndroid15Insets();  // 👈 nuevo paso
        await this.hideStatusBar();
        // 1️⃣ Inicializar safe area
        await this.initSafeArea();
      }
    });
  }

  private async fixAndroid15Insets() {
    const info = await Device.getInfo();

    if (Capacitor.getPlatform() === 'android' && Number(info.osVersion) >= 15) {
      await EdgeToEdge.enable();
    } else {
      await EdgeToEdge.disable();
    }
  }

  async hideStatusBar(){
   // await StatusBar.hide();
    await StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#00000000' });
  };

  // -------------------------------
  // 🔹 SAFE AREA INTEGRATION
  // -------------------------------
  private async initSafeArea() {
    try {
      // Obtener insets al iniciar
      const { insets } = await SafeArea.getSafeAreaInsets();
      this.applyInsetsToCSS(insets);

      // Escuchar cambios dinámicos (rotación, teclado, etc.)
      SafeArea.addListener('safeAreaChanged', (data: { insets: { top: number; bottom: number; left: number; right: number } }) => {
        this.applyInsetsToCSS(data.insets);
      });
    } catch (e) {
      document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
      document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
      document.documentElement.style.setProperty('--safe-area-inset-right', '0px');
    }
  }

  private applyInsetsToCSS(insets: { top: number; bottom: number; left: number; right: number }) {
    document.documentElement.style.setProperty('--safe-area-inset-top', `${insets.top}px`);
    document.documentElement.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
    document.documentElement.style.setProperty('--safe-area-inset-left', `${insets.left}px`);
    document.documentElement.style.setProperty('--safe-area-inset-right', `${insets.right}px`);
  }

  handleBackButton() {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back(); // Va a la página anterior en el historial de navegación
      } else {
        App.exitApp(); // Cierra la aplicación si no hay historial de navegación
      }
    });
  }


  async openStore(){

    const isAndroid = Capacitor.getPlatform() === 'android';
    const isIOS = Capacitor.getPlatform() === 'ios';

    if (isAndroid) {
      const appId = 'com.app.tarotiav2'; // Reemplaza con el ID de tu app en Google Play
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&reviewId=0`;
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: playStoreUrl });
      } else {
        window.open(playStoreUrl, '_blank');
      }
    } else if (isIOS) {
      const appId = 'id1441553118'; // Reemplaza con el ID de tu app en la App Store
      const appStoreUrl = `itms-apps://apps.apple.com/app/${appId}?action=write-review`;
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: appStoreUrl });
      } else {
        window.open(appStoreUrl, '_blank');
      }
    } else {
    }
  }

  async irWeb() {
    const url = 'https://mariafernandeztarot.com/';
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  async irPolitica() {
    const url = 'https://mariafernandeztarot.com/aviso-legal-y-politica-de-privacidad/';
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  }

  private listenNetwork() {
    window.addEventListener('offline', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/offline');
      });
    });
    window.addEventListener('online', () => {
      this.ngZone.run(() => {
        if (this.router.url === '/offline') {
          this.router.navigateByUrl('/inicio');
        }
      });
    });
  }

  private listenInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      if (!this.installPromptShown) {
        this.installPromptShown = true;
        this.showInstallToast();
      }
    });
  }

  private showIOSInstallBanner() {
    if (this.iosInstallShown) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any)['standalone'];
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent);

    if (isIOS && isSafari && !isInStandaloneMode) {
      this.iosInstallShown = true;
      setTimeout(() => this.showIOSInstallToast(), 3000);
    }
  }

  private async showIOSInstallToast() {
    const toast = await this.toastController.create({
      header: '📲 Instala Tarot y Rituales',
      message: 'Pulsa el botón compartir (cuadrado con flecha ↑) en la barra de Safari y selecciona "Añadir a pantalla de inicio"',
      position: 'bottom',
      duration: 15000,
      cssClass: 'install-toast',
      buttons: [
        {
          text: '✓ Entendido',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private async showInstallToast() {
    const toast = await this.toastController.create({
      header: '📲 Instala la app',
      message: 'Accede más rápido y sin conexión. ¡Es gratis!',
      position: 'bottom',
      duration: 10000,
      cssClass: 'install-toast',
      buttons: [
        {
          text: 'Instalar',
          handler: () => {
            if (this.deferredPrompt) {
              this.deferredPrompt.prompt();
              this.deferredPrompt = null;
            }
          }
        },
        {
          text: 'Ahora no',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
