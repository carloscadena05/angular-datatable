import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  API: string = '';
  assets: string = '';

  constructor(public http: HttpClient) {
    const Protocol = window.location.protocol;
    if (window.location.hostname === 'localhost') {
      this.API = Protocol + '//localhost/crud/';
      this.assets = Protocol + '//localhost/crud/docs/';
    } else {
      this.API = Protocol + '//aaaa.com.mx/crud/';
      this.assets = Protocol + '//aaaa.com.mx/crud/docs/';
    }
  }

  APIService(accion: any, id?:any, datos?:any):Observable<any>{
    //console.log(this.API+"?opcion="+accion+"&id="+id,datos);
    return this.http.post(this.API+"?opcion="+accion+"&id="+id,datos);
  }
}
