import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  redirectUrl: string;

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  private loggedUserSubject: BehaviorSubject<any>;
  getLoggedUser: any;
  headers: HttpHeaders = new HttpHeaders( { 'Authorization': 'Bearer ' + this.getToken() } );
  lHeaders: HttpHeaders = new HttpHeaders( { 'Authorization': 'Bearer ' + '*zmaL.qpwO_rknG.uytI.skxN*' })

  constructor( public http: HttpClient ) {

  }

  userLogin(accion:any, datos: any,) {
    //console.log(environment.API+"?opcion="+accion, datos, { headers: this.lHeaders } );
    return this.http.post(environment.API+"?opcion="+accion, datos, { headers: this.lHeaders } ).pipe(map((usuario: any) => {
      this.setToken(usuario['token']);
      this.getLoggedInName.emit(usuario['token']);
      this.getToken();
      return usuario;
    }));
  }

  APIService(accion: any, datos?:any, id?:any):Observable<any>{

    if(id){
      //console.log(environment.API+"?opcion="+accion+"&id="+id,datos,{ headers: this.headers});
      return this.http.post(environment.API+"?opcion="+accion+"&id="+id,datos,{ headers: this.headers}).pipe(map((usuario) => {
        return usuario;
      }));
    } else {
      //console.log(environment.API+"?opcion="+accion,datos,{ headers: this.headers});
      return this.http.post(environment.API+"?opcion="+accion,datos,{ headers: this.headers}).pipe(map((usuario) => {
        return usuario;
      }));
    }
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
