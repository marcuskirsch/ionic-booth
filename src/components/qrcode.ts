import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import qrcode from 'qrcode-generator';

@Component({
  selector: 'booth-qrcode',
  template: '<div [innerHtml]="qrCode"></div>'
})
export class Qrcode {
  @Input() content: string;
  qrCode: SafeHtml;

  constructor(private domSantizier: DomSanitizer) {}

  ngOnInit() {
    let qrCode = qrcode(4, 'L');
    qrCode.addData('http://google.com')
    qrCode.make();

    this.qrCode = this.domSantizier.bypassSecurityTrustHtml(qrCode.createImgTag());
  }
}
