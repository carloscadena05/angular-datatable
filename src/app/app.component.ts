import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-datatable';
  btn_login: boolean;
  btn_logout: boolean;
  userName:string;
  textoError: string;

  constructor( private service: UsersService,
    private router: Router) {
      service.getLoggedInName.subscribe( name => {
        this.changeName(name)
      });
      this.service.APIService('users').subscribe((response: any) => {
      }, (error: any) => {
        this.textoError = error['error']['text'];
      });
    }

  private changeName(name: boolean): void {
    this.btn_logout = name;
    this.btn_login = !name;
  }

  logout() {
    if(this.service.getDataLS('token') && this.service.getDataLS('email') && this.service.getDataLS('nombre')){
      this.service.deleteDataLS('token');
      this.service.deleteDataLS('email');
      this.service.deleteDataLS('nombre');
    }

    window.location.href = '/login';
    this.btn_login = true;
    this.btn_logout = false;
    this.router.navigate(['/login']);
  }

}
