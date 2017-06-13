import { Component } from '@angular/core';
import { ModalController ,NavController, Platform } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File, Entry } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

import { SyncService } from '../../providers/sync';

import { QrcodeModal } from '../qrcode-modal/qrcode-modal';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: string[] = [];
  isCordova = true;
  qrCode: any;
  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private camera: Camera,
    private file: File,
    private platform: Platform,
    private storage: Storage,
    private syncSrv: SyncService
  ) {
    this.isCordova = platform.is('cordova');
  }

  ngOnInit() {
    if (!this.isCordova) {
      return;
    }

    this.syncSrv.sync().then(images => this.images = images).catch(console.log);
  }

  addPhoto() {
    this.camera.getPicture({
      allowEdit: true,
      targetWidth: 1920,
      targetHeight: 1080,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 80
    }).then((fileUri: string) => {
      const pathParts = fileUri.split('/');
      const fileName = pathParts.pop();
      const path = pathParts.join('/');

      return this.file.moveFile(path, fileName, this.file.externalDataDirectory, `${Date.now()}_marriage_${fileName}`)
    }).then((entry: Entry) => this.addImage(entry));
  }

  openModal() {
    const qrModal = this.modalCtrl.create(QrcodeModal);
    qrModal.present();
  }

  private addImage(entry: Entry) {
    this.images.push(this.syncSrv.getFilePath(entry.name));
  }
}
