import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
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

  constructor(
    public formulario: FormBuilder,
    private service:UsersService,
    private ruteador: Router,
    private http: HttpClient
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
      })
     }

  ngOnInit(): void {
    this.estados();
  }

  vFilesChange(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.documentList = event.target.files;
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }

  onRateChange(rating: number){
    this.star = rating;
    this.form.setValue({
      star: this.star
    });
  }

  enviarDatos():any{
    this.form.value.star = this.star;
    console.log(this.form.value)
    this.service.APIService('insertar',null,this.form.value).subscribe(resp=>{
      console.log(resp);
      this.ruteador.navigate(['/login']);
    }, error => {
      console.log(error);
    });

  }

  estados():void {
    this.service.APIService('estados').subscribe((response: any) => {
      this.options = response;
    });
  }

}
