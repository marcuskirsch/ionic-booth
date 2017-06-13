import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class Sync {
  private db;
  constructor(private http: Http) {
  }

  getFiles(): Observable<any> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic YmVubnk6MTIzNDU2');
    headers.append('Content-Type', 'application/json');

    const requestOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: 'https://dropbox-booth.herokuapp.com/dropbox/hochzeit_benny',
      headers: headers
    })

    return this.http.request(new Request(requestOptions))
      .map((res: Response) => res.json());
  }
}
