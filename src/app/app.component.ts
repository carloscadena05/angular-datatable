import { Component, Input } from '@angular/core';
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

  constructor( private service: UsersService) {
    service.getLoggedInName.subscribe( name => {
      //console.log(name);
      this.changeName(name)
    });

    if(this.service.isLoggedIn()){
      //console.log("loggedin");
      this.btn_login = false;
      this.btn_logout = true;
    } else {
      this.btn_login = true;
      this.btn_logout = false;
    }
    //console.log('login',this.btn_login);
    //console.log('logout',this.btn_logout);

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
  }
}
