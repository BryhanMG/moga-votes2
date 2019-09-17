import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidato } from '../Modelo/candidato';
import {Md5} from 'ts-md5/dist/md5';
import { EmitirVoto, CandidatoBC, Voto  } from "src/app/Modelo/modelosBC";
import { LocalHost } from '../Modelo/Localhost';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  readonly URL_API = LocalHost+'/api/conexionbc';


  constructor(private http: HttpClient) { }
/*
  //Transacciones a red Blockchain
  postEmitirVoto(idV: String, idC: String, ip: String){
    var emitir = new EmitirVoto();
    emitir.voto+= idV;
    emitir.candidato+= idC;
    console.log(emitir);
    return this.http.post(this.URL_API_BC+`${ip}:3000/api/`+'EmitirVoto/', emitir);
  }

  postCandidato(idC: number, idE: String, nombre: String, ip: String){
    //let cadena: string = idC+""+idE;
    //let e = Md5.hashStr(cadena);
    //console.log( e.toString());
    
    let candidato = new CandidatoBC(idC.toString(), idE, nombre);

    return this.http.post(this.URL_API_BC+`${ip}:3000/api/`+'Candidato', candidato);  
  }

  postVotante(idV: number, nombre: String, ip: String){
    //console.log(idV.toString() + nombre);
    let e = Md5.hashStr(idV.toString() + nombre);
    //console.log(e);
    
    return this.http.post(this.URL_API_BC+`${ip}:3000/api/`+'Votante', {"id":e.toString()});
  }
*/
  


postVoto(idV: number, idE: String, rol: String, idC: String, ip: String){
    let e = Md5.hashStr(idV.toString() + idE + rol);
    let c = Md5.hashStr(idC.toString()+idE);
    //let voto = new Voto(e.toString(), rol, idC);
    let voto = {votoId: e.toString(), candidato: c.toString()};
    return this.http.post(`https://${ip}:3000/api/`+'org.moga.Voto', voto);
  }
  

  getCandidatos(idE: String, ip: String){
    return this.http.get(`https://${ip}:3000/api/`+`Candidato?filter=%7B%22id_evento%22%3A%20%22${idE}%22%7D`);
  }

  getTotal(idC: String, idE: String, ip: String){
    let c = Md5.hashStr(idC.toString()+idE);
    return this.http.get(`https://${ip}:3000/api/`+`queries/selectVotos?candidato=${c}`);
  }
  
  //---------------------------------------------------------------
  //Transacciones a MongoDB
  getConexionBC(){
    return this.http.get(this.URL_API+'/get');
  }

  updateConexionBC(id: String, ip: String){
    return this.http.put(this.URL_API+`/update/${id}`, {ip: ip});
  }

}
