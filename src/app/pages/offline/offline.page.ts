import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
})
export class OfflinePage {
  offlineMessage = '';

  retry() {
    if (navigator.onLine) {
      this.offlineMessage = '';
      location.reload();
    } else {
      this.offlineMessage = 'Aún no hay conexión a internet. Por favor, comprueba tu conexión e inténtalo de nuevo.';
    }
  }
}
