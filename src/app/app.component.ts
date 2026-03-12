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
import { Router } from '@angular/router';

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
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private location: Location,
    private router: Router,
    private ngZone: NgZone,
    private toastController: ToastController,
  ) {
    this.initializeApp();
    this.listenNetwork();
    this.listenInstallPrompt();
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
      // SafeArea plugin not available on this platform; CSS insets will use defaults
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
      await Browser.open({ url: playStoreUrl });
    } else if (isIOS) {
      const appId = 'id1441553118'; // Reemplaza con el ID de tu app en la App Store
      const appStoreUrl = `itms-apps://apps.apple.com/app/${appId}?action=write-review`;
      await Browser.open({ url: appStoreUrl });
    } else {
    }
  }

  async irWeb() {
    await Browser.open({ url: 'https://mariafernandeztarot.com/' });
  }

  async irPolitica() {
    await Browser.open({ url: 'https://mariafernandeztarot.com/aviso-legal-y-politica-de-privacidad/' });
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

  private async showInstallToast() {
    const toast = await this.toastController.create({
      message: '¿Quieres instalar la app?',
      position: 'bottom',
      duration: 8000,
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
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
