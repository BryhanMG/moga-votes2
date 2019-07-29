import { Component, OnInit } from '@angular/core';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { UserService } from 'src/app/Servicios/user.service';

import { VotacionService } from 'src/app/Servicios/votacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tiempo: Date;
  eventos: EventoVotacion[];
  
  constructor(
    ) { 
    
  }

  ngOnInit() {
    
  }

  

}
