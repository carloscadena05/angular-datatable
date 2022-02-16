import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { environment } from 'src/environments/environment';

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
  unknown: string = '';

  constructor( private service: UsersService,
    private fb: FormBuilder,
    private router: Router ) {
      this.login = this.fb.group({
        email: [ '', [Validators.required, Validators.minLength(6), Validators.email ]],
        pwd:['', [Validators.required]],
      });

    }

  ngOnInit(): void {
    this.unknown = environment.assets + 'unknown.png';
  }

  consultarFoto(event: any){
    this.service.APIService('consultarFoto', {id: this.login.value.email}).pipe(first()).subscribe(res=>{
      //console.log(res);
      this.foto = environment.assets + res[0]['img'];
    }, error => {
      //console.log(error);
    });
  }

  enviarDatos(){
    this.service.userLogin('login', this.login.value).pipe(first()).subscribe((data) => {
      //console.log(data);
      this.validData = false;
      const redirect = this.service.redirectUrl ? this.service.redirectUrl : '/';
      this.router.navigate([redirect]);
    },
    (error) => {
      //console.log(error);
      this.validData = true;
    });
  }

  get email() {
    return this.login.get('email');
  }

  get password() {
    return this.login.get('password');
  }

}
