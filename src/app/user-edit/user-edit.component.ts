import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users/users.service';

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
  API: string = '';
  assets: string = '';

  constructor(
    public formulario:FormBuilder,
    private activateRoute:ActivatedRoute,
    private service: UsersService,
    private ruteador:Router,
  ) {

    const Protocol = window.location.protocol;
    if (window.location.hostname === 'localhost') {
      this.API = Protocol + '//localhost/crud/';
      this.assets = Protocol + '//localhost/crud/docs/';
    } else {
      this.API = Protocol + '//aaaa.com.mx/crud/';
      this.assets = Protocol + '//aaaa.com.mx/crud/docs/';
    }

    this.elID = this.activateRoute.snapshot.paramMap.get('id');
    //console.log(this.elID);

    this.service.APIService('consultar',this.elID).subscribe(
      respuesta=>{
        //console.log(respuesta);
        this.form.setValue({
          nombre:respuesta[0]['nombre'],
          apellido_p:respuesta[0]['apellido_p'],
          apellido_m:respuesta[0]['apellido_m'],
          email:respuesta[0]['email'],
          pwd:respuesta[0]['pwd'],
          sexo:respuesta[0]['sexo'],
          estado:respuesta[0]['estado'],
          texto:respuesta[0]['texto'],
          fecha:respuesta[0]['fecha'],
          img:respuesta[0]['img'],
        });
        return respuesta;
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
    })
   }

  ngOnInit(): void {
    this.getFoto();
    this.estados();
  }

  enviarDatos():any{
    //console.log(this.form.value);
    this.service.APIService('actualizar',this.elID,this.form.value).subscribe((resp)=>{
      //console.log(resp);
    });
    this.ruteador.navigateByUrl('/');
  }

  fileChange(event:any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      //console.log('finfo',file.name,file.size,file.type);
      if((file.size/1048576)<=4) //No mayor a 4MB
      {
        let formData = new FormData();
        formData.append('file', file, file.name);
        this.file_data=formData
        //console.log(this.file_data.value)
        this.service.APIService('foto',this.elID,this.file_data)
          .subscribe();
      } else { }
    }
  }

  getFoto():void{
    this.service.APIService('consultar', this.elID).subscribe( res => {
      this.foto = this.assets + res[0]['img'];
    });
  }

  estados():void {
    this.service.APIService('estados').subscribe((response: any) => {
      //console.log(response[0]['estado']);
      this.options = response;
    });
  }
}
