import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalHost } from '../Modelo/Localhost';

import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  readonly URL_API = LocalHost+'/api';
  constructor(private http: HttpClient,
    private storage: AngularFireStorage) { }
  
  
  postImagen(image: File){
    //console.log(image);
    const formData = new FormData();

    formData.append('file', image);
    return this.http.post(this.URL_API+`/upload/`, formData);
  }

  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
}
