import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  validData: boolean = false;
  documentList: any[] = [];
  selectedFile: any;
  allDocs: any = [];
  myFiles: string [] = [];
  star: any;
  rating: any;
  emailAlready: boolean = false;
  loading: boolean = false;
  readyToLogin: boolean;
  public Editor = ClassicEditor;

  constructor(
    public formulario: FormBuilder,
    private service:UsersService,
    private ruteador: Router,
    private appComponent: AppComponent,
    ) {
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
        star:[''],
      });

      ClassicEditor.defaultConfig = {
        toolbar: {
          items: [
            'heading', '|',
            'bold', 'italic', 'link', 'blockQuote', '|',
            'bulletedList', '|',
            'insertTable', '|',
            'undo', 'redo'
          ]
        },
      };
  }

  ngOnInit(): void {
    this.estados();
    this.appComponent.btn_logout = false;
    this.appComponent.btn_login = true;

  }

  onRateChange(rating: number){
    this.star = rating;
    this.form.setValue({
      star: this.star
    });
  }

  enviarDatos():any{
    this.loading = true;
    this.form.value.star = this.star;
    //console.log(this.form.value)
    this.service.APIService('insertar',this.form.value).subscribe(resp=>{

      //console.log(resp,resp.status);
      if(resp.status == 1){
        Swal.fire({
          title: 'Registro exitoso. Ahora puedes iniciar sesión.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        this.emailAlready = false;
        this.readyToLogin = true;
        this.ruteador.navigate(['/login']);
      } else if (resp.status == 0){
        this.emailAlready = true;
        this.loading = false;
      }
    }, error => {
      //console.log(error);
    });

  }

  estados():void {
    this.service.APIService('estados').subscribe((response: any) => {
      //console.log(response)
      this.options = response;
    }, (error: any) => {
      //console.log(error);
    });
  }

}
