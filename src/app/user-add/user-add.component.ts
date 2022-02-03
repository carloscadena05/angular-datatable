import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  form: FormGroup;
  file = new FormControl('');
  file_data:any='';
  ip="http://localhost/crud/";
  options: any = [];
  estadoInd: any;

  constructor(public formulario: FormBuilder,
    private service:UsersService,
    private ruteador: Router,
    private http: HttpClient) {
      this.form = this.formulario.group({
        nombre:[''],
        apellido_p:[''],
        apellido_m:[''],
        email:[''],
        pwd:[''],
        sexo:[''],
        estado:[''],
        texto:[''],
        fecha:[''],
      })
     }

  ngOnInit(): void {
    this.estados();
  }

  enviarDatos():any{
    //console.log(this.file_data.value)
    this.http.post(this.ip,this.file_data)
      .subscribe(res => {
      }, (err) => {
      });
    //console.log(this.form.value)
    this.service.APIService('insertar',null,this.form.value).subscribe(resp=>{
      //console.log(resp);
    });
    this.ruteador.navigateByUrl('/');
  }

  estados():void {
    this.service.APIService('estados').subscribe((response: any) => {
      this.options = response;
    });
  }

}
