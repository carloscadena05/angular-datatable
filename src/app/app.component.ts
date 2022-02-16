import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-datatable';
  btn_login: boolean = false;
  btn_logout: boolean = true;
  userDisplayname = '';

  constructor( private service: UsersService,
    private router: Router) {
      service.getLoggedInName.subscribe( name => {
        this.changeName(name)
      });

      if(this.service.isLoggedIn()){
        this.btn_login = false;
        this.btn_logout = true;
      } else {
        this.btn_login = true;
        this.btn_logout = false;
      }
    }

  private changeName(name: boolean): void {
    this.btn_logout = name;
    this.btn_login = !name;
  }

  logout() {
    this.service.deleteToken();
    window.location.href = window.location.href;
    this.btn_login = true;
    this.btn_logout = false;
    this.router.navigate(['/login']);
  }
}
