import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';

import { AmazingTimePickerService } from 'amazing-time-picker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { ImagenesService } from "src/app/Servicios/imagenes.service";
import { MaquinaVotacionService } from "src/app/Servicios/maquina-votacion.service";

import { Usuario } from 'src/app/Modelo/usuario';
import { Administrador } from 'src/app/Modelo/administrador';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { Candidato } from 'src/app/Modelo/candidato';
import { CrearEdit, ResponsableE, SubUsuario, nuevoCandidato} from 'src/app/Modelo/crearEdit';
import { Imagen } from 'src/app/Modelo/imagen';
import { MaquinaVotacion } from 'src/app/Modelo/maquinaVotacion';




@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent extends CrearEdit implements OnInit {
  idEvento: string;
  opcion: String;

  opRol: String=""; //Toma el valor del rol seleccionado para un candidato
  rol: String = ""; //nombre del rol que se crea
  des: String = ""; //Descripcion del rol que se crea
  roles = []; //Lista de roles que se agregan
  cancel= true; //boton que cancela la edicion de un rol
  responsables = []; //Lista de responsables que tienen asignado el evento a crear
  idR: String = ""; //id del rol para identificarlo y almacenarlo en la lista de roles
  rolesEliminados = [];

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
    private route: ActivatedRoute,
    private atp: AmazingTimePickerService,
    private usuarioService: UsuarioService,
    private adminService: AdministradorService,
    private votacionService: VotacionService,
    private imagenesService: ImagenesService,
    private maquinaService: MaquinaVotacionService,
    private snackBar: MatSnackBar,
    private locacion: Location) {
    super();
  }

  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.opcion = this.route.snapshot.paramMap.get('op');
    this.firstFormGroup = this._formBuilder.group({
      nombreE: ['', Validators.required],
      fechaI: ['', Validators.required],
      fechaF: ['', Validators.required],
      horaI: ['', Validators.required],
      horaF: ['', Validators.required],
      descripcion: ['']
    });
    this.getEvento(this.idEvento);
    this.getResponsables();
    this.getCandidatos(this.idEvento);
    this.obtenerImagenes();
    this.obtenerMaquinas();

  }

  n: number=0;
  saveRol(){
    if (this.rol !== "") {
      if(this.idR === ""){
        this.idR = this.n +''+ this.evento._id;
        this.roles.push({id: this.idR, rol: this.rol, descripcion: this.des, candidatos: [], nuevo: true});
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
        if (rol.id === this.opRol) {
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

    this.updateGeneral();
  }
  //*************************************************************************************
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

  cancelEdit(){
    this.rol = "";
    this.des = "";
    this.idR = "";
    this.cancel = true;
  }

  deleteRol(id: String){
    var n = 0;
    for (const rol of this.roles) {
      if(rol.id === id){
        if (!rol.nuevo) {
          this.rolesEliminados.push({_id: rol.id});
        }
        //console.log(rol.id);
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
  activarDesactivar(admin: ResponsableE){
    if (admin.estado === "check_circle") {
      admin.estado = "remove_circle_outline"
      admin.administrador.eventos.splice(0, 1);
      if (admin.change) {
        admin.change = false;
      }else{
        admin.change = true;
      }

      var i=0;
      for (const r of this.responsables) {
        if (r.administrador._id === admin.administrador._id) {
          break;
        }
        i++;
      }
      //this.responsables.splice(i, 1);


    }else{
      admin.estado = "check_circle"
      admin.administrador.eventos.push(this.evento._id);
      if (admin.change) {
        admin.change = false;
      }else{
        admin.change = true;
      }
      //this.responsables.push(admin);

    }
    //console.log(this.admins);
    //console.log(this.responsables);
  }

  //Elegir numero de puntos de votación
  noPV = 0;
  listaMaquinas: MaquinaVotacion[];
  sumarPV(){
    this.noPV++;
  }

  restarPV(){
    if (this.noPV > 0) {
      this.noPV--;
    }
  }

  //**************************************************************************************
  //Servicios con conexion a la base de datos
  evento = new EventoVotacion;
  candidatos = [];
  getEvento(id: string){
    this.votacionService.getEvento(id)
      .subscribe(res =>{
        this.evento = res as EventoVotacion;

        this.firstFormGroup.get('nombreE').setValue(this.evento.nombre_ev);
        var FI = new Date(this.evento.fecha_i.substring(0, 10));
        FI.setDate(FI.getDate()+1);
        this.firstFormGroup.get('fechaI').setValue(FI);
        var FF = new Date(this.evento.fecha_f.substring(0, 10));
        FF.setDate(FF.getDate()+1);
        this.firstFormGroup.get('fechaF').setValue(FF);
        this.firstFormGroup.get('horaI').setValue(this.evento.fecha_i.substring(11, 16));
        this.firstFormGroup.get('horaF').setValue(this.evento.fecha_f.substring(11, 16));
        this.firstFormGroup.get('descripcion').setValue(this.evento.descripcion);
      });
  }

  getCandidatos(id: string){
    this.votacionService.getCandidatos(id)
      .subscribe(res =>{
        this.votacionService.candidatos = res as Candidato[];
        //console.log(res);
        for (const rol of this.votacionService.candidatos) {
          this.roles.push({id: rol._id, rol: rol.rol, descripcion: rol.descripcion, candidatos: [], nuevo: false});
          //console.log(rol);
          for (const can of rol.candidatos) {
            let c = can as SubUsuario;
            //console.log(c._id);
            //console.log(this.n+''+rol.id_ev);
            this.getUsuario(c._id, null, rol._id, 3, c.imagen);
          }
          this.n++;

        }
        //console.log(this.roles);

      });
  }

  idUsuario: String;
  nombreU:String;
  idU: String = null;
  admins= [];

  getUsuario(id: String, admin: Administrador, idRol: String, op: number, imagen: String){

    if (id != null) {

      this.usuarioService.getUsuario(id)
          .subscribe(res =>{
            this.usuarioService.usuario = res as Usuario;
            //console.log(this.usuarioService.usuario);
            if (this.usuarioService.usuario != null) {
              this.obtenerUsuario(this.usuarioService.usuario, admin, idRol, op, imagen);
            }else{
              this.openSnackBar("Usuario no econtrado", "Cerrar");
            }

          });

    }else{
      this.openSnackBar("Campo Código vacio", "Cerrar");
    }
    this.idUsuario = null;

    //this.nombreU = this.usuarioService.usuario.nombres +" "+this.usuarioService.usuario.apellidos
  }

  getResponsables(){
    this.adminService.getAdminsAE()
      .subscribe(res =>{
        this.adminService.admins = res as Administrador[];
        //console.log(this.adminService.admins);
        for (const a of this.adminService.admins) {
          this.getUsuario(a._id, a,"", 2, "");
        }

      });
  }

  //**************************************************************************************
  //Paso final en la cracion de actualizacion
  updateGeneral(){
    this.evento.nombre_ev = this.firstFormGroup.get('nombreE').value;
    this.evento.fecha_i = this.fechaI;
    this.evento.fecha_f = this.fechaF;
    this.evento.descripcion = this.firstFormGroup.get('descripcion').value;
    this.evento.estado = "E";
    this.votacionService.updateEvento(this.evento)
        .subscribe(res => {
          //console.log(res);
          this.openSnackBar("Evento actualizado", "Cerrar");
        });
  }

  updateCandidatos(){
    this.candidatos = [];
    for (const can of this.roles) {
      let ca = new Candidato();
      //console.log(can);
      ca._id = can.id;
      ca.id_ev = this.evento._id;
      ca.rol = can.rol;
      ca.descripcion = can.descripcion;
      ca.nuevo = can.nuevo;
      for (const c of can.candidatos) {
        ca.candidatos.push({_id: c.idU, votos: 0, imagen: c.imagen});
      }
      this.candidatos.push(ca);
    }
    //console.log(this.candidatos);
    for (const can of this.candidatos) {

      if (can.nuevo) {
        let candidato = new nuevoCandidato(can.id_ev, can.rol, can.descripcion, can.candidatos);
        this.votacionService.addCandidato(candidato)
        .subscribe(res => {
          //console.log(res);
        });
      }else{
        this.votacionService.updateCandidato(can)
        .subscribe(res => {
          //console.log(res);
        });
      }
    }

    for (const ce of this.rolesEliminados) {
      this.votacionService.deleteCandidato(ce._id)
        .subscribe(res =>{
          //console.log(res);
        });
    }
    this.openSnackBar("Candidatos actualizados", "Cerrar");
  }

  updateResponsables(){

    //console.log(this.admins);
    for (const ad of this.admins) {
      if(ad.change){
        //console.log(ad.administrador);
        this.adminService.updateAdminEventos(ad.administrador)
          .subscribe(res =>{
            //console.log(res);
            ad.change = false;
          });
      }

    }

    if (this.noPV > this.listaMaquinas.length) {
      for (let i = this.listaMaquinas.length; i < this.noPV; i++) {
        var maquina = new MaquinaVotacion;
        maquina._id = "MA"+(i+1)+this.evento._id;
        maquina.id_ev = this.evento._id;
        maquina.numero = i+1;
        maquina.codigo = this.generadorClave();
        maquina.estado = "B";
        this.maquinaService.postMaquina(maquina)
          .subscribe(res =>{
            //console.log(res);
            this.obtenerMaquinas();
          });

      }

    }else if (this.noPV < this.listaMaquinas.length) {
      for (let i = this.listaMaquinas.length; i > this.noPV; i--) {
        //console.log("MA"+i+this.idEvento);
        this.maquinaService.deleteMaquina("MA"+i+this.idEvento)
          .subscribe(res => {
            //console.log(res);
            this.obtenerMaquinas();
          });

      }

    }
    this.openSnackBar("Responsables actualizados", "Cerrar");

  }


  //*************************************************************************************************
  //Opciones para hacer con la obtencion de un usuario
  obtenerUsuario(user: Usuario, admin: Administrador, idRol: String, op: number, imagen: String){
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
          let a = new ResponsableE();
          a.nombres = user.nombres;
          a.apellidos = user.apellidos;
          a.administrador = admin;
          for (const n of a.administrador.eventos) {
            if (n === this.idEvento) {
              a.estado = "check_circle";
              this.responsables.push(a);
            }
          }
          this.admins.push(a);
          //console.log(this.admins);
        }
        break;
      case 3:
        if (user != null) {
          for (const rol of this.roles) {
            if (rol.id === idRol) {
              rol.candidatos.push({idU: user._id, nombreU: user.nombres+' '+user.apellidos, imagen: imagen});
              //console.log(rol.candidatos);
              break;
            }
          }

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

  //Obtener maquibas del evento
  obtenerMaquinas(){
    this.maquinaService.getMaquinas(this.idEvento)
      .subscribe(res => {
        this.listaMaquinas = res as MaquinaVotacion[];
        //console.log(this.listaMaquinas);
        this.noPV = this.listaMaquinas.length
      });
  }

  backClicked() {
    this.locacion.back();
   }
}
