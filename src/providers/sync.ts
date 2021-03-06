import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

export const HOST = 'https://dropbox-booth.herokuapp.com'; //'http://localhost:5000'
export const API_URL = HOST + '/dropbox';

@Injectable()
export class SyncService {
  private _targetDir: string;
  constructor(
    private http: Http,
    private transfer: Transfer,
    private file: File,
    platform: Platform
  ) {
    platform.ready().then(() => {
      this._targetDir = platform.is('android') ? file.externalDataDirectory : file.documentsDirectory;
    });
  }

  get targetDir(): string {
    return this._targetDir;
  }

  getDropBoxFiles(): Observable<any> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic YmVubnk6MTIzNDU2');
    headers.append('Content-Type', 'application/json');

    const requestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: `${API_URL}/hochzeit_benny`,
      headers: headers
    })

    return this.http.request(new Request(requestOptions))
      .map((res: Response) => res.json().entries);
  }

  getTempLink(path) {
    let headers = new Headers();
    headers.append('Authorization', 'Basic YmVubnk6MTIzNDU2');
    headers.append('Content-Type', 'application/json');

    const requestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: `${API_URL}${path}`,
      headers: headers
    })

    return this.http.request(new Request(requestOptions))
      .map((res: Response) => res.json().link)
      .toPromise();
  }

  download(path: string): Promise<string> {
    const fileTransfer: TransferObject = this.transfer.create();

    const fileName = path.split('/').pop();
    const newPath = this.getFilePath(fileName);

    return this.getTempLink(path)
      .then(link => fileTransfer.download(link, newPath))
      .then((file) => newPath);
  }

  getLocalFiles(): Promise<string[]> {
    const pathParts = this.targetDir.split('/');
    pathParts.pop();
    const dir = pathParts.pop();
    this.targetDir.split('/').pop()

    return this.file.listDir(pathParts.join('/'), dir)
      .then((result) => {
        const files = [];
        result.forEach((entry) => {
          if (entry.isFile) {
            files.push(this.getFilePath(entry.name));
          }
        });

        return files;
      });
  }

  sync(): Promise<string[]> {
    let images: string[] = [];
    return this.getLocalFiles().then(files => {
      images = files;
      return this.getDropBoxFiles().toPromise();
    }).then(dropboxFiles => {
      let downloads = [];

      dropboxFiles.forEach(dropboxFile => {
        const dropboxFileName = this.getFileName(dropboxFile.path_lower);

        if (images.indexOf(this.getFilePath(dropboxFileName)) === -1) {
          downloads.push(this.download(dropboxFile.path_lower))
        }
      });

      return Promise.all(downloads);
    }).then(downloadedFiles => {
      return images.concat(downloadedFiles);
    });
  }

  getFileName(path: string): string {
    return path.split('/').pop();
  }

  getFilePath(name: string): string {
    return `${this.targetDir}${name}`;
  }
}
