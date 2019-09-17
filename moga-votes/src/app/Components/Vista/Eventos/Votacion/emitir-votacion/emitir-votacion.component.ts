import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';

import { VotacionService } from 'src/app/Servicios/votacion.service';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { BlockchainService } from 'src/app/Servicios/blockchain.service';
import { MaquinaVotacionService } from "src/app/Servicios/maquina-votacion.service";

import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { Candidato } from 'src/app/Modelo/candidato';
import { Usuario } from 'src/app/Modelo/usuario';
import { Votante, SubUsuario, ConexionBC } from 'src/app/Modelo/crearEdit'
import { MaquinaVotacion } from 'src/app/Modelo/maquinaVotacion';
import { CandidatoBC } from 'src/app/Modelo/modelosBC';


export class Rol{
  rol: String;
  arreglo =[];
} 


@Component({
  selector: 'app-emitir-votacion',
  templateUrl: './emitir-votacion.component.html',
  styleUrls: ['./emitir-votacion.component.css']
})
export class EmitirVotacionComponent implements OnInit {
  idEvento: String;
  noMaquina: String;
  
  candidatosUpdate: Candidato[];

  idVotante: String;
  totalRoles = 0;
  roles =[];
  rolShow=[];
  candidatos= [];
  votante: Votante;

  flagVoto = true;
  flagValidar = false;

  mensaje: String;

  constructor(private route: ActivatedRoute,
    private votacionService: VotacionService,
    private usuarioService: UsuarioService,
    private maquinaService: MaquinaVotacionService,
    private blockchainService: BlockchainService,
    ) { 
      
    }

  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.noMaquina = this.route.snapshot.paramMap.get('no');
    this.obtenerIP();
  }
  
  validarVotante(){
    this.votacionService.getVotante(this.idEvento, this.idVotante)
      .subscribe(res => {
        this.votante = res['votantes'][0] as Votante;
        //console.log(this.votante);
        if (this.votante != null) {
          if (this.votante.maquina === "A") {
            if (this.votante.voto === "NE") {
              this.getCandidatos();
              this.actualizarMaquina("AU");
              this.flagValidar = true;
              
            }else{
              this.mensaje = "*Votante ya emitió su voto.";
            }
          }else if(this.votante.maquina === "NA"){
            this.mensaje = "*Votante no autenticado.";
          }else{
            this.mensaje = "*Votante ya emitió su voto.";
          }
          
          
        }else{
          this.mensaje = "*Votante no registrado.";
        }
      });
    
  }

  actualizarMaquina(estado: String){
    var maquina = new MaquinaVotacion();
    maquina.estado = estado;
    this.maquinaService.upadeteMaquina("MA"+this.noMaquina+this.idEvento, maquina)
      .subscribe(res => {
        //console.log(res);
      });
  }
  
  getCandidatos(){
    this.roles= [];
    this.votacionService.getCandidatos(this.idEvento.toString())
      .subscribe(res =>{
        this.candidatosUpdate = res as Candidato[];
        this.votacionService.candidatos = res as Candidato[];
        //console.log(res);
        
        for (const rol of this.votacionService.candidatos) {
          //console.log(rol);
          
          this.roles.push({idR: rol._id, rol: rol.rol, count: this.totalRoles, arreglo: [], seleccionado: false,});
          
          this.candidatos = [];
          for (const can of rol.candidatos) {
            //console.log(can);
            var s = can as SubUsuario;
            this.obtenerUsuario(rol.rol, s);
          }
          if (rol.rol === this.roles[0].rol) {
            this.rolShow = [{idR: rol._id, rol: rol.rol, count: 0, arreglo: this.candidatos, seleccionado: false,}];  
          }
          //console.log(this.roles);
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
                  apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos, imagen: s.imagen, flag: false});
                if(r.rol === this.roles[0].rol){
                  this.rolShow[0].arreglo.push({_id: this.usuarioService.usuario._id, nombres: this.usuarioService.usuario.nombres,
                    apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos, imagen: s.imagen, flag: false})
                }
                
                break;    
              }
            }
            //console.log(this.rolShow);
          });
  }
  //seleccion de candidato y emision de voto
  votosSeleccionado = [];
  
  //funcion que guarda la eleccion del candidato para pasar a la siguiente candidatura
  siguiente(){
    //console.log(this.rolShow[0].count);
    
    if ((this.rolShow[0].count+1) < this.totalRoles) {
      //console.log(this.roles[this.rolShow[0].count+1]);
      this.rolShow[0] = this.roles[this.rolShow[0].count+1];
      this.flagVoto = !this.rolShow[0].seleccionado;
    }
    //console.log(this.rolShow[0]);
  }
  anterior(){
    //console.log(this.rolShow[0].count);

    if ((this.rolShow[0].count-1) > -1) {
      //console.log(this.roles[this.rolShow[0].count+1]);
      this.rolShow[0] = this.roles[this.rolShow[0].count-1];
      this.flagVoto = !this.rolShow[0].seleccionado;
      
    }
    //console.log(this.rolShow[0]);
    //console.log(this.rolShow[0]);
  }

  addVoto(candidatoSeleccionado: number){
    //let e = Md5.hashStr(this.idVotante.toString() + this.idEvento + this.rolShow[0].rol);
    //console.log(this.rolShow[0]);
    if (this.votosSeleccionado.length == 0) {
      //this.votosSeleccionado.push({idV: e.toString(), idC: candidatoSeleccionado, rol: this.rolShow[0].rol});
      this.votosSeleccionado.push({idV: this.idVotante.toString(), idC: candidatoSeleccionado, rol: this.rolShow[0].rol, idR: this.rolShow[0].idR});
    }else{
      var flag = false;
      for (const voto of this.votosSeleccionado) {
        if (voto.rol === this.rolShow[0].rol) {
          voto.idC = candidatoSeleccionado;
          flag = true;
          
          break;
        }
      }
      if (!flag) {
        //this.votosSeleccionado.push({idV: e.toString(), idC: candidatoSeleccionado, rol: this.rolShow[0].rol});
        this.votosSeleccionado.push({idV: this.idVotante.toString(), idC: candidatoSeleccionado, rol: this.rolShow[0].rol, idR: this.rolShow[0].idR});
      }
    }
    //console.log(this.votosSeleccionado);
  }

//--------------------------------------------------------------------------
  //----Acciones con red blockchain
  //Emitir voto que ingresa activo en la red blockchain
  ipConexionBC= new ConexionBC();
  emitirVotos(){
    
    //console.log(this.votosSeleccionado)
    for (const voto of this.votosSeleccionado) {
      //console.log(voto);
      //console.log(voto.idV+" / "+ this.idEvento+" / "+ voto.rol+" / "+ voto.idC);
      
      //Insercion del voto del votante a la red blockcahin
      this.blockchainService.postVoto(voto.idV, this.idEvento, voto.rol , voto.idC, this.ipConexionBC.ip)
        .subscribe(res => {
          //console.log(res);
          console.log("Voto emitido");
          
          this.blockchainService.getTotal(voto.idC, this.idEvento, this.ipConexionBC.ip)
            .subscribe(res => {
              let lista = res as [];
              //console.log(lista);
              //console.log("Total: "+lista.length);
              this.actualizarCandidatos(voto, lista.length);
              
            });
          });
      /*
      this.blockchainService.postEmitirVoto(voto.idV, voto.idC)
        .subscribe(res =>{
          //console.log(res);
          this.blockchainService.getCandidatos(this.idEvento)
            .subscribe(res =>{
              var candidatos = res as CandidatoBC[];
              //console.log(candidatos);
              this.actualizarCandidatos(candidatos);
              
            }, error => console.log("Hubo un error al obtener los candidatos."));
        }, error => {
          console.log("Imposible emitir su voto.");
          
        });    
      */
      
    }
    this.actualizarVotante();
    this.actualizarMaquina("A");
    this.flagValidar = false;
    this.idVotante= null;
    this.totalRoles = 0;
    this.mensaje = "";
    this.roles =[];
    this.rolShow=[];
    this.candidatos= [];
    this.votosSeleccionado = [];
    
    

    //this.votacionService.getVotante(this.idEvento);    
    
  }

  obtenerIP(){
    this.blockchainService.getConexionBC()
      .subscribe(res => {
        this.ipConexionBC = res[0] as ConexionBC;
        //console.log(this.ipConexionBC);
      });
  }

//---------------------------------------------------------------------------
  actualizarVotante(){//Actualizar el votante registrado en el evento de votación
    let vo = [{votantes: [this.votante]}];
    //console.log(vo);
    
    this.votacionService.deleteVotante(this.idEvento, vo)
      .subscribe(res => {
        //console.log(res);
        this.votante.voto = "E";
        this.votante.maquina = "MA"+this.noMaquina+this.idEvento;
        
        let vo = [{votantes: [this.votante]}];
        //console.log(vo);
        this.votacionService.addVotante
        this.votacionService.addVotante(this.idEvento, vo)
          .subscribe(res =>{
            //console.log(res);
            
          });
      });

  }

  seleccionar(seleccion: number){
    //console.log(this.roles);
    this.addVoto(seleccion);
    this.roles[this.rolShow[0].count].seleccionado = true;
    
    //console.log(this.roles);
    for (const r of this.roles[this.rolShow[0].count].arreglo) {
      r.flag = false;
    }
    for (const can of this.rolShow[0].arreglo) {
      //console.log(seleccion+" === "+can._id);
      //console.log(can);
      if (seleccion === can._id) {
        can.flag = true;
        break;  
      }
      
    }
    this.roles[this.rolShow[0].count] = this.rolShow[0];
    //console.log(this.roles[this.rolShow[0].count]);
    //console.log(this.votosSeleccionado);
    this.flagVoto = false;

  }
  
  actualizarCandidatos(voto: Object, total: number){//Actualizar el total de votos del candidato
    for (const candidato of this.votacionService.candidatos) {
      if (candidato._id  === voto['idR']) {
        for (const can of candidato.candidatos) {
          if (can['_id'] === voto['idC']) {
            can['votos'] = total;
            //console.log(candidato);
            this.votacionService.updateCandidato(candidato)
              .subscribe(res => {
                //console.log(res);
              });
          }
        }
        
      }  
    }
  }


/*
  actualizarCandidatos(candidatos: CandidatoBC[]){//Actualizar el total de votos del candidato
    for (const can of candidatos) {
      for (const cu of this.candidatosUpdate) {
        if (can.candidato === cu.rol) {

          for (const c of cu.candidatos) {
            if (can.id == c['_id'].toString()) {
              c['votos'] = can.votos;
            }
          }
          
          
        }
      }
      
    }

    for (const cu of this.candidatosUpdate) {
      this.votacionService.updateCandidato(cu)
            .subscribe(res => {
              console.log(res);
            });
    }

  }*/
}
