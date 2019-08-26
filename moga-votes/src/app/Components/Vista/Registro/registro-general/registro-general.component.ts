import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

import { UploaderService } from "src/app/Servicios/uploader.service";
import { ImagenesService } from "src/app/Servicios/imagenes.service";
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/usuario';
import { EliminarUsuarioDialogComponent } from '../../MisDialogs/eliminar-usuario-dialog/eliminar-usuario-dialog.component';
import { ImportRegistrosDialogComponent } from '../../MisDialogs/import-registros-dialog/import-registros-dialog.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-registro-general',
  templateUrl: './registro-general.component.html',
  styleUrls: ['./registro-general.component.css']
})
export class RegistroGeneralComponent implements OnInit {
  @ViewChild('imageIn', {static: true}) imagenField: ElementRef;
  opCancelar = "Limpiar";

  formGroup= new FormGroup({
    idUsuario: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl('')
  });

  constructor(private _formBuilder: FormBuilder,
    private uploadService: UploaderService,
    private imagenesService: ImagenesService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      idUsuario: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['']
    }); 
  }

  //Registrar usuario
  guardarUsuario(){
    if (this.formGroup.valid) {
      var usuario = new Usuario();
      usuario._id = this.formGroup.get("idUsuario").value;
      usuario.nombres = this.formGroup.get("nombres").value;
      usuario.apellidos = this.formGroup.get("apellidos").value;
      usuario.correo = this.formGroup.get('correo').value;

      if (this.editar) {
        this.usuarioService.putUsuario(usuario)
          .subscribe(res=>{
            //console.log(res);
            this.limpiarCampos();
            this.editar =false;
          });
      }else{
        this.usuarioService.postUsuario(usuario)
          .subscribe(res => {
            //console.log(res);
            this.limpiarCampos();
          });
      }
      //console.log("Entra aqui: "+this.formGroup.valid);  
    }
  }

  //Limpiar campos del registro
  limpiarCampos(){
    if (this.editar) {
     this.formGroup.controls["idUsuario"].enable();
     this.opCancelar = "Limpiar"; 
     this.editar = false;
    }
    this.formGroup.get("idUsuario").setValue("");
    this.formGroup.get("nombres").setValue("");
    this.formGroup.get("apellidos").setValue("");
    this.formGroup.get("correo").setValue("");
    
  }



  //Realizar busqueda y ver información del registro del usuario.
  idUser = "----"
  nombres = "----"
  apellidos = "----"
  correo = "----"
  id: String;
  ferror = false;
  fusuario = true;
  buscar(){
    this.usuarioService.getUsuario(this.id)
      .subscribe(res => {
        //console.log(res);
        if (res != null) {
          this.ferror = false;
          this.fusuario = false;
          this.id=null;
          this.idUser = res["_id"];
          this.nombres = res["nombres"];
          this.apellidos = res["apellidos"];
          this.correo = res["correo"];  
        }else{
          this.ferror = true;
          this.fusuario = true;
        }
      });
  }

  limpiarInformacion(){
    this.idUser = "----";
    this.nombres = "----";
    this.apellidos = "----";
    this.correo = "----";
    this.fusuario = true;
  }

  editar = false;
  editarRegistro(){
    this.editar = true;
    this.formGroup.get("idUsuario").setValue(this.idUser);
    this.formGroup.controls["idUsuario"].disable();
    this.formGroup.get("nombres").setValue(this.nombres);
    this.formGroup.get("apellidos").setValue(this.apellidos);
    this.formGroup.get("correo").setValue(this.correo);
    this.opCancelar = "Cancelar";
    this.fusuario = false;
    this.limpiarInformacion();
  }

  //Eliminar registro
  eliminarRegistro(){
    this.openDialog();
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EliminarUsuarioDialogComponent, {
      data: {idUser: this.idUser,
        nombres: this.nombres,
        apellidos: this.apellidos,
        correo: this.correo}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      console.log('The dialog was closed');
      if (result) {
        this.limpiarInformacion();
      }
    });
  }

  //-------------------------------------------------------------------------------------
  //Subir imagen al servidor
  /*
  selectedFile: ImageSnippet;
  
  fileChangeEvent(imageInput: any){
    console.log(imageInput);
      const file: File = imageInput.files[0];
      const reader = new FileReader();
      
      reader.addEventListener('load', (event: any) =>{
        this.selectedFile = new ImageSnippet(event.target.result, file);

        this.uploadService.postImagen(this.selectedFile.file)
          .subscribe(res => {
            //console.log(res['filename']);
            this.guardarImagen({imagen: res['filename']});
            //console.log(this.imagenes);
          }, error => console.log(error));
      });

      reader.readAsDataURL(file);
  }

  guardarImagen(imagen: any){
    console.log(imagen);
    this.imagenesService.postImagen(imagen)
      .subscribe(res => {
        console.log(res);
        
      });
  }*/

  importDialog(): void {
    const dialogRef = this.dialog.open(ImportRegistrosDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //console.log('The dialog was closed');
      
    });
  }

  urlImage: String;
  uploadPercent: number = 0;
  opUpload = 0;
  uploadImage(){
    this.opUpload = 1;
    const id = Math.random().toString(36).substring(2);
    const file = this.selectedImage;
    const filePath = `upload-moga/imagen_${id}`;
    let referencia = this.uploadService.referenciaCloudStorage(filePath);
    let task = this.uploadService.tareaCloudStorage(filePath, file);
    
    task.percentageChanges().subscribe((porcentaje) => {
      this.uploadPercent = Math.round(porcentaje);
      //console.log(this.uploadPercent);
    });
    
    task.snapshotChanges().pipe(
      finalize(() => {
        referencia.getDownloadURL().subscribe(downloadURL => {
          //console.log('File available at', downloadURL);
          
          this.imagenField.nativeElement.value = '';
          this.imgSrc = '../../../assets/imgs/image_preview.png';
          this.opUpload = 2;

          this.imagenesService.postImagen(downloadURL)
            .subscribe(res => {
              //console.log(res);
            });
        }, error => {console.log(error)});
      })
    ).subscribe();
    this.fSelected = true;
  }

  imgSrc: String = '../../../assets/imgs/image_preview.png';
  selectedImage: any = null;
  fSelected = true;
  showPreview(event: any){
    //console.log(event.target.files);
    this.opUpload = 0;
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.fSelected = false;
    }else{
      this.imgSrc = '../../../assets/imgs/image_preview.png';
      this.selectedImage = null;
    }
  }
}



class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
