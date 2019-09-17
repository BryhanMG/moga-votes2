import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import { VotacionService } from 'src/app/Servicios/votacion.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { RelojService } from "src/app/Servicios/reloj.service";

import { Candidato } from 'src/app/Modelo/candidato';
import { Usuario } from 'src/app/Modelo/usuario';
import { SubUsuario } from 'src/app/Modelo/crearEdit';
import { TerminarEventoDialogComponent } from '../../../MisDialogs/terminar-evento-dialog/terminar-evento-dialog.component';



export class CandidatoLista{
  _id: number;
  nombres: String;
  apellidos: String;
  correo: String;
  votos: number;

  constructor(){
      this._id = 0;
      this.nombres= '';
      this.apellidos = '';
      this.correo = '';
      this.votos = 0;
  }
}

export class Rol{
  rol: String;
  arreglo =[];
} 


@Component({
  selector: 'app-resumen-votacion',
  templateUrl: './resumen-votacion.component.html',
  styleUrls: ['./resumen-votacion.component.css'],
  providers: [VotacionService]
})
export class ResumenVotacionComponent implements OnInit, OnDestroy {
  idEvento: string;
  evento= new EventoVotacion();
  roles =[];
  candidatos= [];
  estado: String;
  
  //Temporizadores
  private r1Subsciption;

  constructor(private reloj: RelojService,
    private route: ActivatedRoute,
    private eventoService: VotacionService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    
    
  ) { 
    this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
      //this.tiempo = now;
      //console.log("tiempo", now);
      this.idEvento = this.route.snapshot.paramMap.get('id');
      if (this.idEvento) {
        this.getEvento(this.idEvento);
        //this.getCandidatos();  
      }
      
    });
  }

  ngOnInit() {
    
    //this.getEvento(this.idEvento);
    //this.getCandidatos();
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }
  flagCan = false;
  getEvento(id: string){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        //console.log(res);
        if (res != null) {
          this.evento = res as EventoVotacion;
          this.estado = this.evento.estado;  
        }
        if (!this.flagCan) {
          this.getCandidatos();
          this.flagCan = true;
        }
        //console.log(res);
      });
  }

  getCandidatos(){
    this.roles= [];
    this.eventoService.getCandidatos(this.idEvento)
      .subscribe(res =>{
        this.eventoService.candidatos = res as Candidato[];
        //console.log(res);
        for (const rol of this.eventoService.candidatos) {
          //console.log(rol);
          this.roles.push({idR: rol._id, rol: rol.rol, descripcion: rol.descripcion, arreglo: []});
          this.candidatos = [];
          for (const can of rol.candidatos) {
            //console.log(can);
            var s = can as SubUsuario;
            this.obtenerUsuario(rol.rol, s);
          }
          //this.getCandidato(rol);  
        }
        
      });
  }
  
 

  obtenerUsuario(rol: String, s: SubUsuario){
    this.usuarioService.getUsuario(s._id)
          .subscribe(res =>{
            this.usuarioService.usuario = res as Usuario
            for (const r of this.roles) {
              if (r.rol === rol) {
                //console.log(r);
                r.arreglo.push({_id: this.usuarioService.usuario._id, nombres: this.usuarioService.usuario.nombres,
                  apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos});
                break;    
              }
            }
            
            //console.log(this.roles);
          });
  }

  terminarEvento(){
    this.evento.estado = 'T';
    var f = new Date();
    f.setHours(f.getHours()-6);
    this.evento.fecha_f = f.toISOString();
    this.eventoService.updateTerminar(this.evento)
      .subscribe(res => {
        //console.log(res);
        this.getEvento(this.idEvento);
      });
  }

  //Dialog para terminar el evento
  terminarDialog(id: String, nombre: String): void {
    const dialogRef = this.dialog.open(TerminarEventoDialogComponent, {
      data: {id: id, nombre: nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.terminarEvento();
      }
    });
  }
  
}


