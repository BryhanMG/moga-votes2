import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador } from '../Modelo/administrador';
import { LocalHost } from "../Modelo/Localhost";

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  readonly URL_API = LocalHost+'/api/admins';
  admin: Administrador;
  admins: Administrador[];

  constructor(private http: HttpClient) { }

  //Obtener todos los administradores
  getAdministradores(){
    return this.http.get(this.URL_API + `/get_all/`);
  }

  //Obtener administrador especifico
  getAdministrador(id: String){
    return this.http.get(this.URL_API + `/get/${id}`);
  }

  //Obtener administrador especifico
  getEventosAE(id: String){
    return this.http.get(this.URL_API + `/get_evt/${id}`);
  }

  //crear un nuevo administradro
  postAdministrador(admin: Object){
    return this.http.post(this.URL_API + `/create/`, admin);
  }

  //Obtener administradores a los que se les puede asignar un evento
  getAdminsAE(){
    return this.http.get(this.URL_API + `/getAE/`);
  }

  //Agregar un evento a un administrador de tipo especial
  addAdminEvento(admin: Administrador){
    return this.http.put(this.URL_API+ `/addEvento/${admin._id}`, admin);
  }

  //Actualizar la lista de eventos asignados
  updateAdminEventos(admin: Administrador){
    return this.http.put(this.URL_API+ `/updateEventos/${admin._id}`, admin);
  }
  
  //Actualizar contraseña
  updateAdminPass(admin: Object){
    return this.http.put(this.URL_API+ `/updatePass/${admin['_id']}`, admin);
  }
  

  //Eliminar administrador
  deleteAdministrador(id: String){
    return this.http.delete(this.URL_API + `/delete/${id}`);
  }
}
