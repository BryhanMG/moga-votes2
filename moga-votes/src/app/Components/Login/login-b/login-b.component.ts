import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MaquinaVotacionService } from 'src/app/Servicios/maquina-votacion.service';
import { MaquinaVotacion} from 'src/app/Modelo/maquinaVotacion';


@Component({
  selector: 'app-login-b',
  templateUrl: './login-b.component.html',
  styleUrls: ['./login-b.component.css']
})
export class LoginBComponent implements OnInit {
  idEvento: String = "";
  codigo: String = "";
  constructor(private route: Router,
    private maquinaService: MaquinaVotacionService) { }

  ngOnInit() {

  }


  mensaje:String = null;
  login(){
    this.maquinaService.getMaquinaLogin(this.idEvento)
      .subscribe(res => {
        if (res != null) {
          this.maquinaService.maquina = res as MaquinaVotacion;
          //console.log(this.maquinaService.maquina);
          if (this.maquinaService.maquina.codigo === this.codigo) {
            //console.log("ingresa");
            if (this.maquinaService.maquina.estado === 'A') {
              this.mensaje = null;
              this.route.navigate([`/emisionVoto/${this.maquinaService.maquina.id_ev}/${this.maquinaService.maquina.numero}`]);
            }else{
              console.log("Evento bloqueado");
              this.mensaje = "* Punto de votación bloqueado";
            }

          }else{
            console.log("no ingresa");
            this.mensaje = "* Contraseña o ID de maquina incorrecto";
          }
        }else{
          this.mensaje = "* Contraseña o ID de maquina incorrecto";
        }


      }, error => {
        console.log("Imposible acceder");
      });
  }


  tipo= "password";
  fpass = false;
  showHidePassword(){
    this.fpass = !this.fpass;
    if (this.fpass) {
      this.tipo = "text";
    }else{
      this.tipo = "password";
    }
  }



}
