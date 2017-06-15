import { Component, ViewChild } from '@angular/core';
import { ModalController ,NavController, Platform, Slides, ToastController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File, Entry } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

import io from 'socket.io-client';

import { SyncService, HOST } from '../../providers/sync';

import { QrcodeModal } from '../qrcode-modal/qrcode-modal';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  images: string[] = [];
  isCordova = true;
  qrCode: any;
  socket: any;
  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private camera: Camera,
    private file: File,
    private platform: Platform,
    private storage: Storage,
    private syncSrv: SyncService,
    private toastCtrl: ToastController
  ) {
    this.isCordova = platform.is('cordova');
  }

  ngOnInit() {
    if (!this.isCordova) {
      return;
    }

    this.socket = io(HOST);
    this.socket.on('image_uploaded', (uploadedImage) => this.imageUploadedHandler(uploadedImage));

    this.platform.ready()
      .then((readySource) => {
        return this.syncSrv.sync()
      })
      .then(images => this.images = images)
      .catch(console.log);
  }

  addPhoto() {
    this.camera.getPicture({
      allowEdit: true,
      cameraDirection: this.camera.Direction.FRONT,
      targetWidth: 1920,
      targetHeight: 1080,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 80
    }).then((fileUri: string) => {
      const pathParts = fileUri.split('/');
      const fileName = pathParts.pop();
      const path = pathParts.join('/');

      return this.file.moveFile(path, fileName, this.syncSrv.targetDir, `${Date.now()}_marriage_${fileName}`);
    }).then((entry: Entry) => this.addImage(this.syncSrv.getFilePath(entry.name)));
  }

  openModal() {
    const qrModal = this.modalCtrl.create(QrcodeModal);
    qrModal.present();
  }

  private addImage(image: string) {
    const index = this.slides.getActiveIndex();
    this.images.splice(index, 0, image);
    this.slides.update();
  }

  private imageUploadedHandler(uploadedImage) {
    this.syncSrv.download(uploadedImage.path_lower).then(downloadedFile => {
      let toast = this.toastCtrl.create({
        message: 'Ein neues Bild ist da!',
        duration: 3000,
        position: 'top'
      });

      toast.present();
      toast.onDidDismiss(() => {
        this.addImage(downloadedFile);
      });
    });
  }
}
