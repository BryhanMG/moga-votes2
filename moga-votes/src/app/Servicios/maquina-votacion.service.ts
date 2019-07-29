import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaquinaVotacion} from 'src/app/Modelo/maquinaVotacion';
import { LocalHost } from '../Modelo/Localhost';
@Injectable({
  providedIn: 'root'
})
export class MaquinaVotacionService {
  maquinas: MaquinaVotacion[];
  maquina: MaquinaVotacion;
  constructor(private http: HttpClient) { }
  readonly URL_API = LocalHost+'/api/maquinas/';

  getMaquinas(id_ev: String){
    return this.http.get(this.URL_API+`getAll/${id_ev}`);
  }

  getMaquinaLogin(id_ev: String){
    return this.http.get(this.URL_API+`login/${id_ev}`);
  }

  postMaquina(maquina: MaquinaVotacion){
    return this.http.post(this.URL_API+'crearMaquina', maquina);
  }

  upadeteMaquina(id: String,maquina: MaquinaVotacion){
    return this.http.put(this.URL_API+`update/${id}`, maquina);
  }

  deleteMaquina(idM: String){
    return this.http.delete(this.URL_API+`delete/${idM}`);
  }

}
