import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';

export class Config {

  public static get API(): string {
    return 'https://api.amplitude.com/httpapi';
  }

  public static extractData(res: Response) {
    const body = res.json() || {};
    return Promise.resolve(res);
  }

  public static handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
