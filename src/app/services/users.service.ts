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
  headers: HttpHeaders = new HttpHeaders( { 'Authorization': 'Bearer ' + this.getDataLS('token') } );
  lHeaders: HttpHeaders = new HttpHeaders( { 'Authorization': 'Bearer ' + '*zmaL.qpwO_rknG.uytI.skxN*' })

  constructor( public http: HttpClient ) {

  }

  userLogin(accion:any, datos: any,) {
    //console.log(environment.API+"?opcion="+accion, datos, { headers: this.lHeaders } );
    return this.http.post(environment.API+"?opcion="+accion, datos, { headers: this.lHeaders } ).pipe(map((usuario: any) => {
      this.setDataLS('token',usuario['token']);
      this.getLoggedInName.emit(usuario['token']);
      this.getDataLS('token');
      this.setDataLS('email',usuario['email']);
      this.setDataLS('nombre',usuario['nombre']);
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

  setDataLS(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getDataLS(key: string) {
    return localStorage.getItem(key) || '';
  }

  deleteDataLS(key: string) {
    localStorage.removeItem(key);
  }

  isLoggedIn() {
    const usertoken = this.getDataLS('token');
    if (usertoken != null) {
      //console.log('true')
      return true;
    }
    return false;
  }

}
