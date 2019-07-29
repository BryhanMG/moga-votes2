import { Component, OnInit, OnDestroy } from '@angular/core';
import { VotacionService } from 'src/app/Servicios/votacion.service'
import {RelojService} from 'src/app/Servicios/reloj.service';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { User } from 'src/app/Modelo/user';
import { UserService } from 'src/app/Servicios/user.service';
import { AdministradorService } from 'src/app/Servicios/administrador.service';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit, OnDestroy {
  listaEventos = [];
  listaOpcion = [];
  estado="";
  mostrar="Z";
  entrada="";

  userLogged: User;
  //Temporizadores
  private r1Subsciption;

  constructor(private reloj: RelojService,
    private eventoService: VotacionService,
    private userService: UserService,
    private adminService: AdministradorService) { }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
    if (this.userLogged.tipo == 2) {
      this.adminService.getEventosAE(this.userLogged.username)
        .subscribe(res => {
          if (res) {
            //console.log(res[0]['eventos']);  
            for (const evt of res[0]['eventos']) {
              this.getEventosAdminEspecial(evt);
            }
          }
        });
    }else{
      this.getEventos();
    }

    this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
      //console.log("tiempo", now);
      this.comprobarEventos();
      
    });
  }

  ngOnDestroy(): void {
    //console.log("Se destruye este componente.")
    this.r1Subsciption.unsubscribe();
  }

  comprobarEventos(){
    this.eventoService.getEventosRevision("A")
        .subscribe(res => {
          var eventos = res as EventoVotacion[];
          for (const evento of this.listaEventos) {
            for (const aev of eventos) {
              if (evento["_id"] === aev["_id"]) {
                evento["estado"]="A";
                continue;
              }  
            }
            
          }

          
        });
      this.eventoService.getEventosRevision( "T")
      .subscribe(res => {
        var eventos = res as EventoVotacion[];
        
        
        for (const evento of this.listaEventos) {
          for (const aev of eventos) {
            if (evento["_id"] === aev["_id"]) {
              evento["estado"]="T";
              continue;
            }  
          }
          
        }

        
      });
  }
  

  getEventos(){
    this.eventoService.getEventos()
      .subscribe(res =>{
        this.listaEventos = res as EventoVotacion[];
        this.listaOpcion = res as EventoVotacion[];
        //console.log(this.listaEventos);
      });
  }

  getEventosAdminEspecial(id: String){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        let eve= res as EventoVotacion;
        this.listaEventos.push(eve)
        this.listaOpcion.push(eve);
        //console.log(this.listaEventos);
      });
  }

  indentificarEstado(estado: string): String{
    this.estado = estado;
    if (estado === "A") {
      return "A";
    }
    return "N";
  }

  opcionMostrar(){
    //console.log("opcion: "+this.mostrar);
    var lista = [];
    if(this.mostrar === 'Z'){
      this.listaEventos = this.listaOpcion;
    }else{
      for (const ev of this.listaOpcion) {
        //console.log("estado A: "+ev.estado + " estado B: "+this.mostrar);

        if (this.mostrar === ev.estado) {
          lista.push(ev);
        }
      }
      this.listaEventos = lista;
    }
    //console.log(lista);
  }

  buscar(){
    var lista = [];
    for (const ev of this.listaOpcion) {
      //console.log(ev.nombre_ev);
      //console.log(this.entrada);
      if (ev.nombre_ev.includes(this.entrada) || ev._id.includes(this.entrada)) {
        lista.push(ev);
      }
    }
    this.listaEventos = lista;
  }
}
