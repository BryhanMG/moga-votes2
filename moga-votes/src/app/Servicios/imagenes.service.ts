import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Imagen } from "src/app/Modelo/imagen";
import { LocalHost } from '../Modelo/Localhost';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  readonly URL_API = LocalHost+'/api/imagenes';
  imagenes: Imagen[];

  constructor(private http: HttpClient) { }

  getImagenes(){
    return this.http.get(this.URL_API + `/get/`);
  }

  postImagen(imagen: String){
    return this.http.post(this.URL_API + `/post/`, {imagen: imagen});
  }
}
