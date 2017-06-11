import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'qrcode-modal',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Eigene Bilder</ion-title>
      <ion-buttons right>
        <button ion-button clear (click)="close()">
          Schließen
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  <ion-content padding text-center>
    <p>Zum Hochladen eigener Bilder könnt ihr einfach folgenden Barcode abscannen oder den darunter stehende Link auf eurem Gerät aufrufen.</p>
    <booth-qrcode content="{{url}}"></booth-qrcode>
    <b>http://tinyurl.com/yck8sca5</b>
  </ion-content>
`
})
export class QrcodeModal {
  constructor(
    private viewCtrl: ViewController
  ) {}
  url = 'http://tinyurl.com/yck8sca5';

  close() {
    this.viewCtrl.dismiss();
  }
}
