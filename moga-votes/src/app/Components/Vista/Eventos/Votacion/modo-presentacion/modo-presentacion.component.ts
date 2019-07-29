import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VotacionService } from 'src/app/Servicios/votacion.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { Candidato } from 'src/app/Modelo/candidato';
import { Usuario } from 'src/app/Modelo/usuario';
import { SubUsuario } from 'src/app/Modelo/crearEdit';
/*
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
}*/

export class Rol{
  rol: String;
  arreglo =[];
} 


@Component({
  selector: 'app-modo-presentacion',
  templateUrl: './modo-presentacion.component.html',
  styleUrls: ['./modo-presentacion.component.css']
})
export class ModoPresentacionComponent implements OnInit {
  idEvento = "MAR20VO2019";
  idRol = "";
  evento= new EventoVotacion;
  totalRoles = 0;
  roles =[];
  rolShow=[];
  candidatos= [];
  estado: string;

  constructor(private route: ActivatedRoute,
    private eventoService: VotacionService,
    private usuarioService: UsuarioService) { }
    
  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.idRol = this.route.snapshot.paramMap.get('idR');
    //console.log("evento: "+this.idEvento+"   Rol: "+this.idRol);
    this.getCandidatos();
    

  }

  getCandidatos(){
    this.roles= [];
    this.eventoService.getCandidatos(this.idEvento)
      .subscribe(res =>{
        this.eventoService.candidatos = res as Candidato[];
        //console.log(res);
        this.totalRoles = 0;
        
        for (const rol of this.eventoService.candidatos) {
          //console.log(rol);
          this.roles.push({idR: rol._id, rol: rol.rol, count: this.totalRoles, arreglo: []});
          
          this.candidatos = [];
          for (const can of rol.candidatos) {
            //console.log(can);
            var s = can as SubUsuario;
            this.obtenerUsuario(rol.rol, s);
          }
          if (rol.rol === this.idRol) {
            this.rolShow = [{idR: rol._id, rol: rol.rol, count: this.totalRoles, arreglo: this.candidatos}];  
          }
          //this.getCandidato(rol);
          this.totalRoles++;
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
                  apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos, imagen: s.imagen});
                if(r.rol === this.idRol){
                  this.rolShow[0].arreglo.push({_id: this.usuarioService.usuario._id, nombres: this.usuarioService.usuario.nombres,
                    apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos, imagen: s.imagen})
                }
                
                break;    
              }
            }
            
            //console.log(this.roles);
          });
  }

  siguiente(){
    //console.log(this.rolShow[0].count);
    if ((this.rolShow[0].count+1) < this.totalRoles) {
      //console.log(this.roles[this.rolShow[0].count+1]);
      this.rolShow[0] = this.roles[this.rolShow[0].count+1];
    }else{
      this.rolShow[0] = this.roles[0];
    }
    //console.log(this.rolShow[0]);
  }
  anterior(){
    //console.log(this.rolShow[0].count);
    if ((this.rolShow[0].count-1) > -1) {
      //console.log(this.roles[this.rolShow[0].count+1]);
      this.rolShow[0] = this.roles[this.rolShow[0].count-1];
    }else{
      this.rolShow[0] = this.roles[this.totalRoles-1];
    }
    //console.log(this.rolShow[0]);
  }

  actualizar(){
    this.getCandidatos();
  }
}
