import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as config from '../../auth_config.json';

import { Entry } from './entities/Entry'
import { User } from './entities/User';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private _entriesUrl = './assets/json/Entries.json';
  private _resultsUrl = './assets/json/Results.json';

  constructor(private http: HttpClient) {}

  ping$(): Observable<any> {
    console.log(config.apiUri);
    return this.http.get(`${config.apiUri}`);
  }

  getUsers() {
    return this.http.get<User[]>(this._entriesUrl);
  }

  getResults() {
    return this.http.get<Entry>(this._resultsUrl);
  }
}
