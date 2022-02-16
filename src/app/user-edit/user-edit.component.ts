import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  elID: any;
  file_data: any = '';
  file = new FormControl('');
  imageSrc: any;
  foto: any;
  options: any = [];
  assets: string = '';
  maxSize: boolean = false;
  documentList: any[] = [];
  selectedFile: any;
  allDocs: any = [];
  myFiles: string [] = [];
  star: any;
  rating: any;

  constructor(
    public formulario:FormBuilder,
    private activateRoute:ActivatedRoute,
    private service: UsersService,
    private ruteador:Router,
  ) {

    this.elID = this.activateRoute.snapshot.paramMap.get('id');
    //console.log(this.elID);

    this.service.APIService('consultar',{id: this.elID}).subscribe(
      respuesta=>{
        this.star = respuesta[0]['star'];
        this.form.setValue({
          nombre:respuesta[0]['nombre'],
          apellido_p:respuesta[0]['apellido_p'],
          apellido_m:respuesta[0]['apellido_m'],
          email:respuesta[0]['email'],
          pwd:respuesta[0]['pwd'],
          sexo:respuesta[0]['sexo'],
          estado:respuesta[0]['id'],
          texto:respuesta[0]['texto'],
          fecha:respuesta[0]['fecha'],
          img:respuesta[0]['img'],
          files:respuesta[0]['files'],
          star:this.star,
        });
      }, error => {
        //console.log(error);
      }

    );

    this.form=this.formulario.group({
      nombre:[''],
      apellido_p:[''],
      apellido_m:[''],
      email:[''],
      pwd:[''],
      sexo:[''],
      estado:[''],
      texto:[''],
      fecha:[''],
      img:[''],
      star:['']
    })
   }

  ngOnInit(): void {
    this.getFoto();
    this.estados();
    this.getDocs();
  }

  fileChange(event:any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      //console.log('finfo',file.name,file.size,file.type);
      if((file.size/1048576)<=4) { //No mayor a 4MB
        this.maxSize = false;
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(file);
        let formData = new FormData();
        formData.append('file', file, file.name);
        this.file_data=formData
        //console.log(this.file_data.value)

      } else {
        this.maxSize = true;
      }
    }
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
    if(this.documentList.length > 0){
      const formData = new FormData();
      for (var i = 0; i < this.myFiles.length; i++) {
        formData.append("file[]", this.myFiles[i]);
      }
      this.service.APIService('pdf',formData,this.elID).subscribe(res => {
        //console.log(res);
      },
      error => {
        //console.log(error);
      })
    }
    this.service.APIService('foto',this.file_data,this.elID).subscribe((respuesta) => {
      //console.log(respuesta);
    }, (error) => {
      //console.log(error);
    });
    this.form.value.star = this.star;
    this.form.value.id = this.elID;
    //console.log(this.form.value);
    this.service.APIService('actualizar',this.form.value).subscribe((resp)=>{
      //console.log(resp);
    },(error) => {
      //console.log(error);
    });

    this.ruteador.navigateByUrl('/');
  }

  getFoto():void{
    this.service.APIService('consultar', {id: this.elID}).subscribe( res => {
      this.foto = environment.assets + res[0]['img']
    });
  }

  getDocs():void {
    this.service.APIService('consultar', {id: this.elID}).subscribe ( respuesta => {
      //console.log(respuesta[0]['docs'])
      this.allDocs = JSON.parse(respuesta[0]['docs']);
    });
  }

  estados():void {
    this.service.APIService('estados').subscribe((response: any) => {
      //console.log(response[0]['estado']);
      this.options = response;
    });
  }
}
