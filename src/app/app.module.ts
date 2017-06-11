import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { Qrcode } from '../components/qrcode';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QrcodeModal } from '../pages/qrcode-modal/qrcode-modal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Qrcode,
    QrcodeModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QrcodeModal
  ],
  providers: [
    Camera,
    File,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
