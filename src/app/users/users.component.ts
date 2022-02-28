import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component'
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  allUsers: any = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  fotos: any;
  assets: string = '';
  min: any = 0;
  max: any = 100;
  rating: any = [];
  estado: any = [];
  textoError: any;

  private deleteObject = {
    id: 0,
    deletedBy: ''
  }
  public Editor = ClassicEditor;

  constructor( private service: UsersService,
    private appComponent: AppComponent  ) { }

  ngOnInit(): void {
    this.users();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      dom: 'frBtip',
      buttons: {
        dom: {
          button: {
            tag: 'button',
            className: ''
          }
        },
        buttons: [
          {
            extend: 'excel',
            className: 'rounded-md border border-teal-400 text-teal-400 py-1.5 px-4 hover:bg-teal-400/10 duration-300 mr-2 my-4',
            titleAttr: 'Excel export.',
            text: 'Excel',
            filename: 'excel-export',
            extension: '.xlsx'
          },
          {
            extend: 'csv',
            className: 'rounded-md border border-blue-400 text-blue-400 py-1.5 px-4 hover:bg-blue-400/10 duration-300 mr-2 my-4',
            titleAttr: 'CSV export.',
            text: 'CSV',
            filename: 'csv-export',
            extension: '.csv'
          },
          {
            extend: 'print',
            className: 'rounded-md border border-red-400 text-red-400 py-1.5 px-4 hover:bg-red-400/10 duration-300 mr-2 my-4',
            titleAttr: 'Excel export.',
            text: 'Print',

          },
          {
          extend: 'copy',
          className: 'rounded-md border border-yellow-400 text-yellow-400 py-1.5 px-4 hover:bg-yellow-400/10 duration-300 mr-2 my-4',
          titleAttr: 'Copy table data.',
          text: 'Copy'
          }
        ]
      },
      language: {
        searchPlaceholder: 'Buscar...',
        search: '',
        lengthMenu: 'Mostrar <select class="rounded-md border border-blue-400 text-blue-400 py-2 px-4 hover:bg-blue-400/10 my-4 mr-2"> <option value="10">10</option> <option value="20">20</option><option value="30">30</option><option value="40">40</option><option value="50">50</option><option value="-1">All</option> </select> registros',
        paginate:{
          first: '<button class="rounded-md border border-blue-400 text-blue-400 py-2 px-4 hover:bg-blue-400/10 my-2 mr-2">Primera página</button>',
          last: '<button class="rounded-md border border-blue-400 text-blue-400 py-2 px-4 hover:bg-blue-400/10 my-2 mr-2">Última página</button>',
          next: '<button class="rounded-md border-0 text-teal-400 font-extralight">Siguiente</button>',
          previous: '<button class="rounded-md border-0 bext-bteal400 font-extralight">Anterior</button>',
        },
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "searching": false
      },

    };

    $.fn.dataTable.ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = parseFloat(data[0]) || 0;
        return (Number.isNaN(this.min) && Number.isNaN(this.max)) ||
        (Number.isNaN(this.min) && id <= this.max) ||
        (this.min <= id && Number.isNaN(this.max)) ||
        (this.min <= id && id <= this.max);
    });

    this.appComponent.btn_logout = true;
    this.appComponent.btn_login = false;

  }


  filterById(): void{
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn.dataTable.ext.search.pop();
  }

  users():void {
    this.assets = environment.assets;
    this.service.APIService('users').subscribe((response: any) => {
      //console.log(response)
      this.allUsers = response;
      this.dtTrigger.next();
      for(let i = 0; i < this.allUsers.length; i++){
        this.rating[i] = response[i]['star'];
        //console.log(this.rating[i])
      }
    }, (error: any) => {
      //console.log(error)
      this.textoError = error['error']['text'];
    });
  }


  borrarRegistro(id:any,iControl:any){
    Swal.fire({
      title: '¿Desea borrar el registro?',
      confirmButtonText: 'Sí',
      confirmButtonColor:'#2dd4bf',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#f87171',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteObject.id = id;
        this.deleteObject.deletedBy = this.service.getDataLS('email') as string;
        this.service.APIService('borrar', JSON.stringify(this.deleteObject)).subscribe((respuesta)=>{
          //console.log(respuesta);
          this.allUsers.splice(iControl,1);
        },(error) => {
          //console.log(error);
        });
        Swal.fire({
          title: 'Usuario eliminado de manera correcta!',
          icon:'success',
          showConfirmButton: false,
          timer: 1500
        })
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Usuario no eliminado',
          icon: 'info',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
}
