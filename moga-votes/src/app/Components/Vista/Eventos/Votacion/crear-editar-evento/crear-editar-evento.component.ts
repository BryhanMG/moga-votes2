import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common'; 


import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { ImagenesService } from "src/app/Servicios/imagenes.service";
import { MaquinaVotacionService } from "src/app/Servicios/maquina-votacion.service";

import { Usuario } from 'src/app/Modelo/usuario';
import { Administrador } from 'src/app/Modelo/administrador';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { CrearEdit, nuevoRol, Responsable, nuevoCandidato } from 'src/app/Modelo/crearEdit';
import { Imagen } from 'src/app/Modelo/imagen';
import { MaquinaVotacion } from 'src/app/Modelo/maquinaVotacion';





@Component({
  selector: 'app-crear-editar-evento',
  templateUrl: './crear-editar-evento.component.html',
  styleUrls: ['./crear-editar-evento.component.css']
})
export class CrearEditarEventoComponent extends CrearEdit implements OnInit {
  opRol: String=""; //opcion de rol para asignar a un nuevo candidato
  rol: String = ""; //nombre del rol que se crea
  des: String = ""; //Descripcion del rol que se crea
  roles: nuevoRol[]=[]; //Lista de roles que se agregan
  cancel= true; //boton que cancela la edicion de un rol
  responsables = []; //Lista de responsables que tienen asignado el evento a crear 
  idR: String = ""; //id del rol para identificarlo y almacenarlo en la lista de roles
  
  imagenes: Imagen[];
  imgSeleccionada: String;
  flagImage = false;
  isImgActivo = false;
  itemSelected = false;
  
  
  firstFormGroup= new FormGroup({
    nombreE: new FormControl(''),
    fechaI: new FormControl(''),
    fechaF: new FormControl(''),
    horaI: new FormControl(''),
    horaF: new FormControl(''),
    descripcion: new FormControl(''),
    
  });
  
  
  constructor(private _formBuilder: FormBuilder,
    private atp: AmazingTimePickerService,
    private usuarioService: UsuarioService,
    private adminService: AdministradorService,
    private votacionService: VotacionService,
    private imagenesService: ImagenesService,
    private maquinaService: MaquinaVotacionService,
    private snackBar: MatSnackBar,
    private locacion: Location,    
    ) {
    super();
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nombreE: ['', Validators.required],
      fechaI: ['', Validators.required],
      fechaF: ['', Validators.required],
      horaI: ['', Validators.required],
      horaF: ['', Validators.required],
      descripcion: ['']
    });    
    
    this.getResponsables();
    this.obtenerImagenes();
    //console.log("Hola: "+this.secondFormGroup.get('opRol').value);
  }
  
  
  n: number=1;
  saveRol(){
    if (this.rol !== "") {
      if(this.idR === ""){
        this.idR = this.n +''+ this.evento._id;
        this.roles.push({id: this.idR, rol: this.rol, descripcion: this.des, candidatos: []});
        //console.log(this.roles);
        this.openSnackBar("Rol guardado", "Cerrar");
      }else{
        for (const rol of this.roles) {
          if(rol.id === this.idR){
            rol.rol = this.rol;
            rol.descripcion = this.des;
            this.openSnackBar("Rol actualizado", "Cerrar");
            break;
          }
          
        }
      }
    }else{
      this.openSnackBar("Complete los campos requeridos (*)", "Cerrar");
    }
    
    this.n++;
    this.rol = "";
    this.des = "";
    this.idR = "";
    this.cancel = true;
  }

  saveCandidato(){
    if (this.nombreU != "" && this.opRol != "" && this.idU != null && this.itemSelected) {
      for (const rol of this.roles) {
        if (rol.id === this.opRol ) {
          var fe = false;
          for (const candidato of rol.candidatos) {
            if (candidato["idU"]==this.idU) {
              fe = true;
            }
          }
          if (!fe) {
            rol.candidatos.push({idU: this.idU, nombreU: this.nombreU, imagen: this.imgSeleccionada});
            this.openSnackBar("Candidato guardado", "Cerrar");
            this.idU= null;
            this.nombreU = "";
            this.opRol = "";
            this.idUsuario = null;
            this.imgSeleccionada = "";
            this.isImgActivo = false;
            this.flagImage = false;
            this.itemSelected = false;
            break;  
          }else{
            this.openSnackBar("Candidato ya registrado", "Cerrar");
            break;  
          }
                  
        }
      }
      
    }else{
      this.openSnackBar("Debe completar la informacion (*)", "Cerrar");
    }
    
  }

  deleteCandidato(id: number, idR: String){
    for (const rol of this.roles) {
      //console.log(rol.rol);
      if (rol.id === idR ) {
        var i = 0;
        for (const candidato of rol.candidatos) {
          if (candidato.idU == id) {
            //console.log("Rol: "+rol.id);
            //console.log("Eliminar candidato: "+candidato.idU);
            rol.candidatos.splice(i, 1);  
            this.openSnackBar("Candidato eliminado", "Cerrar");      
            break;
          }
          i++;
        }
      }
    }
  }


  feI: String;
  feF: String;
  fechaI: string;
  fechaF: string;
  obtenerFHIFHF(){
    this.fechaI = this.obtenerFechaI(new Date(this.firstFormGroup.get("fechaI").value), this.firstFormGroup.get("horaI").value);
    this.fechaF = this.obtenerFechaF(new Date(this.firstFormGroup.get("fechaF").value), this.firstFormGroup.get("horaF").value);
    this.feI = this.fechaI.substring(0, 10);
    this.feF = this.fechaF.substring(0, 10);
    

    this.cargarDatosEvento();
  }

  //**********************************************************************************************
  //Paso de la creacion de candidatos
  editRol(id: String){
    this.cancel = false;
    for (const rol of this.roles) {
      if(rol.id === id){
        this.rol = rol.rol;
        this.des = rol.descripcion;
        this.idR = rol.id;
        break;
      }
      
    }
  }

  //Cancelar la edicion de un tipo de candidato
  cancelEdit(){
    this.rol = "";
    this.des = "";
    this.idR = "";
    this.cancel = true;
  }

  //Eliminar un tipo de candidato
  deleteRol(id: String){
    var n = 0;
    for (const rol of this.roles) {
      if(rol.id === id){
        this.roles.splice(n, 1);
        this.openSnackBar("Rol eliminado", "Cerrar");
        break;
      }
      n++;
    }
    this.n--;
    
  }

  //Servicio para el timepicker
  open(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose()
      .subscribe(time =>{
        console.log(time);
    });
  }

  //Seleccion de administradores responsables del evento
  activarDesactivar(admin: Responsable){
    if (admin.estado === "check_circle") {
      admin.estado = "remove_circle_outline"
      admin.administrador.eventos.splice(0, 1);
      
      var i=0;
      for (const r of this.responsables) {
        if (r.administrador._id === admin.administrador._id) {
          break;
        }
        i++;
      }
      this.responsables.splice(i, 1);
      
      
    }else{
      admin.estado = "check_circle"
      admin.administrador.eventos.push(this.evento._id);
      this.responsables.push(admin);
      
    }
    //console.log(this.admins);
    //console.log(this.responsables);
  }
  
  //Elegir numero de puntos de votación
  noPV = 0;
  sumarPV(){
    this.noPV++;
  }

  restarPV(){
    if (this.noPV > 0) {
      this.noPV--;
    }
  }


  //***********************************************************************************************
  //Servicios con conexion a la base de datos
  idUsuario: String;
  nombreU:String;
  idU: String;
  admins= [];
  
  getUsuario(id: String, admin: Administrador, op: number){
    if (id != null) {
      this.usuarioService.getUsuario(id)
            .subscribe(res =>{
              this.usuarioService.usuario = res as Usuario;
              //console.log(this.usuarioService.usuario);
              if (this.usuarioService.usuario != null) {
                this.obtenerUsuario(this.usuarioService.usuario, admin, op);
                
              }else{
                this.openSnackBar("Usuario no econtrado", "Cerrar");
              }
              
            });
      
      //this.nombreU = this.usuarioService.usuario.nombres +" "+this.usuarioService.usuario.apellidos
    }else{
      this.openSnackBar("Campo Código vacio", "Cerrar");
    }
    this.idUsuario = null;
  }
  
  getResponsables(){
    this.adminService.getAdminsAE()
      .subscribe(res =>{
        this.adminService.admins = res as Administrador[];
        if (this.adminService.admins.length == 0) {
          console.log("No hay administradores registrados");  
        }else{
          //console.log(this.adminService.admins);
          for (const a of this.adminService.admins) {
            //console.log(a);
            this.getUsuario(a._id, a, 2);            
          }
        }
      }, error => console.log("Coleccion administradores no existe"));
  }

  //**********************************************************************************************
  //Paso final en la cracion de eventos
  evento = new EventoVotacion;
  candidatos = [];
  cargarDatosEvento(){
    this.votacionService.getEventosCount()
      .subscribe(res => {
        this.votacionService.conteo = res as number;
        
        let f = new Date(this.firstFormGroup.get('fechaI').value);
        this.evento._id = "EVT"+this.votacionService.conteo+"VO"+f.getFullYear();
        this.evento.nombre_ev = this.firstFormGroup.get('nombreE').value;
        this.evento.fecha_i = this.fechaI;
        this.evento.fecha_f = this.fechaF;
        this.evento.descripcion = this.firstFormGroup.get('descripcion').value;
        this.evento.estado = "E";
        
      });
    
  }

  cargarCandidatos(){
    this.candidatos = [];
    for (const can of this.roles) {
      let ca = new nuevoCandidato(this.evento._id, can.rol, can.descripcion, []);
      //console.log(can);
      //ca.id_ev = this.evento._id;
      //ca.rol = can.rol;
      //ca.descripcion = can.descripcion;
      for (const c of can.candidatos) {
        ca.candidatos.push({_id: c.idU, imagen: c.imagen, votos: 0});  
      }
      this.candidatos.push(ca);
    }
    //console.log(this.candidatos);
  }
  totalPCS = 0;
  createEvento(){
    
    this.votacionService.postEvento(this.evento)
        .subscribe(res => {
          //console.log(res);
          this.openSnackBar("Evento creado", "Cerrar");
          this.locacion.back();
        });
          
    
    for (const can of this.candidatos) {
      //console.log(can);
      this.votacionService.addCandidato(can)
        .subscribe(res => {
          //console.log(res);
        });
      
    }

    for (const re of this.responsables) {
      //console.log(re.administrador);
      this.adminService.addAdminEvento(re.administrador)
        .subscribe(res =>{
          //console.log(res);
        });  
    }

    for (let i = 0; i < this.noPV; i++) {
      var maquina = new MaquinaVotacion;
      maquina._id = "MA"+(i+1)+this.evento._id;
      maquina.id_ev = this.evento._id;
      maquina.numero = i+1;
      maquina.codigo = this.generadorClave();
      maquina.estado = "B";
      this.maquinaService.postMaquina(maquina)
        .subscribe(res =>{
          //console.log(res);
        });
    }
  }

  
 

//*************************************************************************************************
  //Opciones para hacer con la obtencion de un usuario
  obtenerUsuario(user: Usuario, admin: Administrador, op: number){
    //console.log(user);
    switch (op) {
      case 1:
        if (user != null) {
          this.idU = user._id;
          this.nombreU = user.nombres+" "+user.apellidos;
          this.isImgActivo = true;
          this.flagImage = false;
          this.itemSelected = false;  
        }
        break;
      case 2:
        if (user != null) {
          let a = new Responsable();
          a.nombres = user.nombres;
          a.apellidos = user.apellidos;
          a.administrador = admin;
          a.administrador.eventos = [];
          this.admins.push(a);
          //console.log(this.admins);
        }
        break;
      
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  //Metodos para imagenes
  obtenerImagenes(){
    this.imagenesService.getImagenes()
      .subscribe(res => {
        this.imagenes = res as Imagen[];
        for (const img of this.imagenes) {
          img.imagen = "../../../../../../assets/upload/"+img.imagen;
        }
        //console.log(this.imagenes);
      });
  }

  elegirImagen(){
    this.itemSelected = true;
  }

  seleccionarImagen(){
    this.flagImage = true;
    this.isImgActivo = false;
    
  }

  
  
}
