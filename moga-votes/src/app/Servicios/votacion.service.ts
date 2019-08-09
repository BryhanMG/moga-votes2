import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventoVotacion } from '../Modelo/eventoVotacion';
import { Candidato } from '../Modelo/candidato';
import { nuevoCandidato } from '../Modelo/crearEdit'
import { Votante } from '../Components/Vista/Eventos/Votacion/registro/registro.component';
import { LocalHost } from '../Modelo/Localhost';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  selectedEvento: EventoVotacion;
  conteo: number;
  evento: EventoVotacion;
  eventos: EventoVotacion[];
  candidatos: Candidato[]; 
  readonly URL_API_EVENTO = LocalHost+'/api/eventos';
  readonly URL_API_CANDIDATO = LocalHost+'/api/candidatos';
  
  constructor(private http: HttpClient) {
    this.selectedEvento = new EventoVotacion;
   }
   //Obtener todos los eventos de votacion
  getEventos(){
    return this.http.get(this.URL_API_EVENTO+'/get_all/');
  }
  
  //Obtener un evento de votacion
  getEvento(id: String){
    return this.http.get(this.URL_API_EVENTO + `/get/${id}`);
  }

  //Crear evento
  postEvento(evento: EventoVotacion){
    //console.log(evento);
    return this.http.post(this.URL_API_EVENTO+'/create/', evento);
  }

  //Actualizar un evento
  updateEvento(evento: EventoVotacion){
    return this.http.put(this.URL_API_EVENTO+`/update/${evento._id}`, evento);
  }

  //Obtener total de eventos de votacion en la coleccion
  getEventosCount(){
    return this.http.get(this.URL_API_EVENTO+'/getcount/');
  }

  getEventosRevision(estado: String){
    return this.http.get(this.URL_API_EVENTO+`/getR/${estado}`);
  }

  updateEstadoEvento(evento: EventoVotacion){
    return this.http.put(this.URL_API_EVENTO+`/update/${evento._id}`, evento);
  }


  //Actualizar/Terminar evento
  updateTerminar(evento: EventoVotacion){
    return this.http.put(this.URL_API_EVENTO+`/terminar/${evento._id}`, evento);
  }

  //Obtener todos los roles de candidatos del evento especificado
  getCandidatos(id: string){
    return this.http.get(this.URL_API_CANDIDATO + `/get_all/${id}`);
  }
  
  //Agregar candidato para el evento creado
  addCandidato(candidato: nuevoCandidato){
    return this.http.post(this.URL_API_CANDIDATO + '/create/', candidato);
  }

  //actualizar un candidato existente
  updateCandidato(candidato: Candidato){
    return this.http.put(this.URL_API_CANDIDATO + `/update/${candidato._id}`, candidato);
  }

  //Eliminacion de un candidato
  deleteCandidato(id: String){
    return this.http.delete(this.URL_API_CANDIDATO + `/delete/${id}`);
  }

  //Agregar un votante
  addVotante(id:String, votantes: Object){
    //console.log(votantes[0]);
    return this.http.put(this.URL_API_EVENTO + `/add/${id}`, votantes[0]);
  }

  //Eliminar Votante
  deleteVotante(id:String, votantes: Object){
    //console.log(votantes[0]);
    return this.http.put(this.URL_API_EVENTO + `/quit/${id}`, votantes[0]);
  }

  //Obtener un votante
  getVotante(id: String, idV:String){
    return this.http.get(this.URL_API_EVENTO + `/get_v/${id}/${idV}`);
  }
}
