import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  invalidData: boolean = false;
  nombre: string;
  foto: any;
  unknown: string = '';
  loginAvailable: boolean;
  loading: boolean = false;

  constructor( private service: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private appComponent: AppComponent ) {
      this.login = this.fb.group({
        email: [ '', [Validators.required, Validators.minLength(6), Validators.email ]],
        pwd:['', [Validators.required]],
      });
    }

  ngOnInit(): void {
    this.unknown = environment.assets + 'unknown.png';
    this.appComponent.btn_logout = false;
    this.appComponent.btn_login = true;
    //console.log('btn_login',this.appComponent.btn_login,'btn_logout',this.appComponent.btn_logout)
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
    this.loading = true;
    this.service.userLogin('login', this.login.value).pipe(first()).subscribe((data) => {
      //console.log(data);
      this.invalidData = false;
      this.appComponent.btn_logout = true;
      this.appComponent.btn_login = false;
      Swal.fire({
        title: 'Inicio de sesión exitoso',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
      
      this.router.navigateByUrl('/');
    },
    (error) => {
      //console.log(error);
      this.invalidData = true;
      this.loading = false;
    });
  }

  get email() {
    return this.login.get('email');
  }

  get password() {
    return this.login.get('password');
  }

}
