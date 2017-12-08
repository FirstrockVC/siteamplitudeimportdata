import { Injectable } from '@angular/core';
import {RequestOptions,Http, Request, RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Config } from '../../utils/config';

@Injectable()
export class UploadFileService {

  constructor (private http: Http) {}

  public uploadAmplitudeData(events, key): Promise<any> {
    const dataString = 'api_key='+ key + '&event=' + JSON.stringify(events);
    const options = new RequestOptions({
      method: RequestMethod.Post,
      body: dataString
    });
    return new Promise((resolve, reject) => {
      this.http.request(`${Config.API}`,options).toPromise()
      .then(res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
  }
}
