import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  validData: boolean = false;
  nombre: string;
  foto: any;
  API: string = '';
  assets: string = '';
  unknown: string = '';

  constructor( private service: UsersService,
    private fb: FormBuilder,
    private router: Router ) {
      this.login = this.fb.group({
        email: [ '', [Validators.required, Validators.minLength(6), Validators.email ]],
        pwd:['', [Validators.required]],
      });
      const Protocol = window.location.protocol;
      if (window.location.hostname === 'localhost') {
        this.API = Protocol + '//localhost/crud/';
        this.assets = Protocol + '//localhost/crud/docs/';
      } else {
        this.API = Protocol + '//aaaa.com.mx/crud/';
        this.assets = Protocol + '//aaaa.com.mx/crud/docs/';
      }
    }

  ngOnInit(): void {
    this.unknown = this.assets + 'unknown.png';
  }

  consultarFoto(event: any){
    this.service.APIService('consultarFoto', this.login.value.email).pipe(first()).subscribe(res=>{
      this.foto = this.assets + res[0]['img'];
    });
  }

  enviarDatos(){
    //console.log(this.login.value.email);
    //console.log(this.login.value.pwd);
    this.service.userLogin('login', this.login.value.email, this.login.value.pwd).pipe(first()).subscribe((data) => {
      const redirect = this.service.redirectUrl ? this.service.redirectUrl : '/';
      this.router.navigate([redirect]);
    },
    (error) => {
      //console.log(error);
      this.validData = true;
      //alert('Usuario o contraseña incorrectos.');
    });

  }

  get email() {
    return this.login.get('email');
  }

  get password() {
    return this.login.get('password');
  }

}
