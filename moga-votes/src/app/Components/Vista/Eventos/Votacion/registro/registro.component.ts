import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { VotacionService } from 'src/app/Servicios/votacion.service';


import { Usuario } from 'src/app/Modelo/usuario';
import { Candidato } from 'src/app/Modelo/candidato';


export class Votante{
  _id: String;
  votantes: Array<{_id: Number, voto: String}>;
  constructor(){
    
  }
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  idU: String;
  nombre: String;
  correo: String;
  
  idEvento: String;
  codigo: String;
  
  constructor(private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private votacionService: VotacionService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id');

  }

  getUsuario(){
    this.usuarioService.getUsuario(this.codigo)
      .subscribe(res =>{
        if(res != null){
          this.usuarioService.usuario = res as Usuario;
          //console.log(res);
          this.idU = this.usuarioService.usuario._id;
          this.nombre = this.usuarioService.usuario.nombres+' '+this.usuarioService.usuario.apellidos;
          this.correo = this.usuarioService.usuario.correo;
          this.codigo = null;
        }else{
          this.openSnackBar("Registro no encontrado", "Cerrar");
        }
        
      });
  }

  addVotante(){
    this.votacionService.getVotante(this.idEvento, this.idU)
      .subscribe(res =>{
        var vo: Votante;
        vo = res as Votante;
        //console.log(vo.votantes.length);
        if (vo.votantes.length == 0) {
          let vo = [{votantes: [{_id:this.idU, voto: "NE", maquina: "NA"}]}]
          this.votacionService.addVotante(this.idEvento, vo)
            .subscribe(res =>{
              //console.log(res);
              //this.addVotoVotante();
              this.openSnackBar("Votante registrado", "Cerrar");
              this.idU = null;
              this.nombre = "";
              this.correo = "";
            });
        }else{
          //console.log("este usuario ya esta registrado");
          this.openSnackBar("Votante ya existe", "Cerrar")
        }
        
      });
      
    
  }

  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
