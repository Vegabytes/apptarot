import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
})
export class OfflinePage {
  retry() {
    location.reload();
  }
}
