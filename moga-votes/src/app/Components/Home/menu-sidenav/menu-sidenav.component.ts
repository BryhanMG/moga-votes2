import { Component, OnInit, OnDestroy } from '@angular/core';
import {RelojService} from 'src/app/Servicios/reloj.service';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import { CrearEdit } from 'src/app/Modelo/crearEdit';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { Candidato } from 'src/app/Modelo/candidato';
import { MaquinaVotacion } from 'src/app/Modelo/maquinaVotacion';

import { VotacionService } from 'src/app/Servicios/votacion.service';
import { BlockchainService } from 'src/app/Servicios/blockchain.service';
import { MaquinaVotacionService } from 'src/app/Servicios/maquina-votacion.service';
import { CambiarPasswordDialogComponent } from 'src/app/Components/Vista/MisDialogs/cambiar-password-dialog/cambiar-password-dialog.component';
import { User } from 'src/app/Modelo/user';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { UserService } from 'src/app/Servicios/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu-sidenav',
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.css']
})
export class MenuSidenavComponent extends CrearEdit implements OnInit, OnDestroy {

  idUser: String;
  usuario: String;
  userLogged: User;

  showHome: boolean = true;
  opened: true;
  opcion: number=0;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  tiempo: Date;
  eventos: EventoVotacion[];
  candidatos: Candidato[];

  //Temporizadores
  private r1Subsciption;
  private r2Subsciption;

  constructor(private reloj: RelojService,
    private votacionServicio: VotacionService,
    private blockchainService: BlockchainService,
    private maquinaService: MaquinaVotacionService,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private userService: UserService,
    private router: Router,
    ) {
    super();
    this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
      this.tiempo = now;
      //console.log("tiempo", this.tiempo);
      this.comprobarEventosEspera();
      //this.userLogged = this.userService.getUserLoggedIn();
    });

    this.r2Subsciption = this.reloj.timeSecondSession.subscribe((now: Date) => {
      //console.log("Estamos aqui")
      this.userLogged = this.userService.getUserLoggedIn();
      if (!this.userLogged) {
        this.router.navigateByUrl('/error-logout');
      }
    });
  }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
    if (this.userLogged) {
      this.idUser = this.userLogged.username;
      //console.log(this.userLogged);
      this.obtenerUsuario(this.userLogged.username);
    }
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
    this.r2Subsciption.unsubscribe();
  }

  obtenerUsuario(id: String){
    this.usuarioService.getUsuario(id)
      .subscribe(res => {
        //console.log(res);
        this.usuario = res['nombres'];
      });

  }

  activarApartado(op: number){
     this.opcion = op;
  }

  changeShowHome(){
    //console.log("Si cambia");
    this.showHome = false;
  }

  cerrarSesion(){
    this.userService.closeSession();
    //this.locacion.back();
    this.router.navigateByUrl('/login')
  }

  comprobarEventosEspera(){

    this.votacionServicio.getEventosRevision( "E")
      .subscribe(res => {
        this.eventos = res as EventoVotacion[];

        for (const evento of this.eventos) {
          var fechaI = new Date(evento.fecha_i.toString());
          var fechaF = new Date(evento.fecha_f.toString());
          fechaI.setHours(fechaI.getHours()+6);
          fechaF.setHours(fechaF.getHours()+6);
          //console.log(fechaI +"<=" +this.tiempo);
          if ( fechaI <= this.tiempo  && fechaF >= this.tiempo) {
            //console.log("Se activa el evento: ", evento.nombre_ev);
            evento.estado = "A";
            this.cambiarEstadoEvento(evento);
            this.actualizarMaquina(evento._id, "A");
          }
        }
      });

      this.votacionServicio.getEventosRevision("A")
        .subscribe(res => {
          this.eventos = res as EventoVotacion[];
          //console.log(res);
          for (const evento of this.eventos) {
            //console.log(evento);
            let fechaF = new Date(evento.fecha_f.toString());
            fechaF.setHours(fechaF.getHours()+6);
            //console.log(fechaF);
            //console.log(this.tiempo);
            //console.log(fechaF <= this.tiempo);
            if ( fechaF <= this.tiempo) {
              evento.estado = "T";
              this.cambiarEstadoEvento(evento);
              this.actualizarMaquina(evento._id, "B");
            }
          }
        });


  }

  cambiarEstadoEvento(evento: EventoVotacion){

    this.votacionServicio.updateEstadoEvento(evento)
      .subscribe(res=>{
        //console.log(res);
      });

    //
  }
/*
  candidatosBC(idE: String){
    this.votacionServicio.getCandidatos(idE.toString())
      .subscribe(res =>{
        this.candidatos = res as Candidato[];
        //console.log(this.candidatos);
        for (const rol of this.candidatos) {
          //console.log(rol);
          for (const can of rol.candidatos) {
            //console.log(can);
            this.blockchainService.postCandidato(can['_id'], idE, rol.rol)
              .subscribe(res => {
                console.log(res);
              });

          }

        }
      });
  }*/

  actualizarMaquina(idE: String, estado: String){
    this.maquinaService.getMaquinas(idE)
      .subscribe(res => {
        this.maquinaService.maquinas = res as MaquinaVotacion[];
        //console.log(this.maquinaService.maquinas);
        for (const maquina of this.maquinaService.maquinas) {
          maquina.estado = estado;
          this.maquinaService.upadeteMaquina(maquina._id, maquina)
            .subscribe(res => {
              //console.log(res);
            });
        }
      });


  }

  //Dialog para cambiar la contraseña del usuario
  passwordDialog(): void {

    const dialogRef = this.dialog.open(CambiarPasswordDialogComponent, {
      data: {idUser: this.userLogged.username
        }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
