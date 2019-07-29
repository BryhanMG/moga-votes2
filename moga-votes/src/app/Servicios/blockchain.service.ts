import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidato } from '../Modelo/candidato';
import {Md5} from 'ts-md5/dist/md5';
import { EmitirVoto, CandidatoBC, Voto  } from "src/app/Modelo/modelosBC";

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  readonly URL_API = 'https://moga-votes.herokuapp.com:3000/api/';


  constructor(private http: HttpClient) { }


  postEmitirVoto(idV: String, idC: String){
    var emitir = new EmitirVoto();
    emitir.voto+= idV;
    emitir.candidato+= idC;
    console.log(emitir);
    return this.http.post(this.URL_API+'EmitirVoto/', emitir);
  }

  postCandidato(idC: number, idE: String, nombre: String){
    //let cadena: string = idC+""+idE;
    //let e = Md5.hashStr(cadena);
    //console.log( e.toString());
    
    let candidato = new CandidatoBC(idC.toString(), idE, nombre);

    return this.http.post(this.URL_API+'Candidato', candidato);  
  }

  postVotante(idV: number, nombre: String){
    //console.log(idV.toString() + nombre);
    let e = Md5.hashStr(idV.toString() + nombre);
    //console.log(e);
    
    return this.http.post(this.URL_API+'Votante', {"id":e.toString()});
  }

  postVoto(idV: number, idE: String, rol: String, idC: String){
    let e = Md5.hashStr(idV.toString() + idE + rol);
    let c = Md5.hashStr(idC.toString()+idE);
    //let voto = new Voto(e.toString(), rol, idC);
    let voto = {votoId: e.toString(), candidato: c.toString()};
    return this.http.post(this.URL_API+'Voto', voto);
  }
  

  getCandidatos(idE: String){
    return this.http.get(this.URL_API+`Candidato?filter=%7B%22id_evento%22%3A%20%22${idE}%22%7D`);
  }

  getTotal(idC: String, idE: String){
    let c = Md5.hashStr(idC.toString()+idE);
    return this.http.get(this.URL_API+`queries/selectVotos?candidato=${c}`);
  }
}
