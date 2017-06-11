import { Component } from '@angular/core';
import { ModalController ,NavController, Platform } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File, Entry } from '@ionic-native/file';

import { QrcodeModal } from '../qrcode-modal/qrcode-modal';

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
    private platform: Platform
  ) {
    this.isCordova = platform.is('cordova');
  }

  ngOnInit() {
    if (!this.isCordova) {
      return;
    }
    const pathParts = this.file.externalDataDirectory.split('/');
    pathParts.pop();
    const dir = pathParts.pop();
    this.file.externalDataDirectory.split('/').pop()
    this.file.listDir(pathParts.join('/'), dir).then((result) => {
      result.forEach((entry) => {
        if (entry.isFile) {
          this.addImage(entry);
        }
      })
    });
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
    this.images.push(this.getFilePath(entry));
  }

  private getFilePath(entry: Entry): string {
    return `${this.file.externalDataDirectory}${entry.name}`;
  }
}
