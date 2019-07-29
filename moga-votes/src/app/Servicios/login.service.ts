import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalHost } from '../Modelo/Localhost';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  localhost = LocalHost;
  //localhost = "192.168.1.11";
  //localhost = "192.168.43.116";
  readonly URL_API_LOGIN = this.localhost+'/api/login';
  readonly URL_API_ADMIN = this.localhost+'/api/admins';

  constructor(private http: HttpClient) {
  }

  //Registrar login
  postLogin(username:String, password:String) {
    return this.http.post(this.URL_API_LOGIN+'/post/', {
      _id: username,
      password: password,     
    });     
  }

  //Eliminar Login
  deleteLogin(id: String) {
    return this.http.delete(this.URL_API_LOGIN+`/delete/${id}`);     
  }

  //obtener login
  getLogin(id: String) {
    return this.http.get(this.URL_API_LOGIN+`/get/${id}`);     
  }

  //Obtener cuenta
  getAdmin(id: String, pass: String){
    return this.http.get(this.URL_API_ADMIN+`/get_pass/${id}/${pass}`);     
  }

}
