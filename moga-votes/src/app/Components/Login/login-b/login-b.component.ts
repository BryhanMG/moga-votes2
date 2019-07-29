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

  

  login(){
    this.maquinaService.getMaquinaLogin(this.idEvento)
      .subscribe(res => {
        this.maquinaService.maquina = res as MaquinaVotacion;
        //console.log(this.maquinaService.maquina);
        if (this.maquinaService.maquina.codigo === this.codigo) {
          //console.log("ingresa");
          if (this.maquinaService.maquina.estado === 'A') {
            this.route.navigate([`/emisionVoto/${this.maquinaService.maquina.id_ev}/${this.maquinaService.maquina.numero}`]);  
          }else{
            console.log("Evento bloqueado");
          }
          
        }else{
          console.log("no ingresa");
        }
        
      }, error => {
        console.log("Imposible acceder");
      });
  }

  


  
  
}
