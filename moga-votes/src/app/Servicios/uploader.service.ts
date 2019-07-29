import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalHost } from '../Modelo/Localhost';




@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  readonly URL_API = LocalHost+'/api';
  constructor(private http: HttpClient) { }
  
  
  postImagen(image: File){
    //console.log(image);
    const formData = new FormData();

    formData.append('file', image);
    return this.http.post(this.URL_API+`/upload/`, formData);
  }
}
