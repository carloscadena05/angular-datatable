import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  API: string = '';
  assets: string = '';
  redirectUrl: string;
  private _loggedInUser?: User;

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor( public http: HttpClient ) {
    const Protocol = window.location.protocol;
    if (window.location.hostname === 'localhost') {
      this.API = Protocol + '//localhost/crud/';
      this.assets = Protocol + '//localhost/crud/docs/';
    } else {
      this.API = Protocol + '//aaaa.com.mx/crud/';
      this.assets = Protocol + '//aaaa.com.mx/crud/docs/';
    }
  }

  public userLogin(accion:any, email: any, pwd: any) {
    //console.log(this.API+"?opcion="+accion, {email, pwd});
    return this.http.post(this.API+"?opcion="+accion, {email, pwd}).pipe(map((User: any) => {
      //alert(email);
      this.setToken(User[0].nombre);
      this.getLoggedInName.emit(User[0].nombre);
      this.getToken();
      return User;
    }));
  }

  APIService(accion: any, id?:any, datos?:any):Observable<any>{
    //console.log(this.API+"?opcion="+accion+"&id="+id,datos);
    return this.http.post(this.API+"?opcion="+accion+"&id="+id,datos).pipe(map((User) => {
      return User;
    }));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      //console.log('true')
      return true;
    }
    return false;
  }

}
