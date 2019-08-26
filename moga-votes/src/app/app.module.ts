import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginAComponent } from './Components/Login/login-a/login-a.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material';

import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { MenuSidenavComponent } from './Components/Home/menu-sidenav/menu-sidenav.component';
import { PrincipalComponent } from './Components/Vista/Eventos/principal/principal.component';
import { InformacionComponent } from './Components/Vista/Eventos/Votacion/informacion/informacion.component';
import { Router } from '@angular/router';
import { ResumenVotacionComponent } from './Components/Vista/Eventos/Votacion/resumen-votacion/resumen-votacion.component';
import { CrearEditarEventoComponent } from './Components/Vista/Eventos/Votacion/crear-editar-evento/crear-editar-evento.component';
import { EditarEventoComponent } from './Components/Vista/Eventos/Votacion/editar-evento/editar-evento.component';
import { ModoPresentacionComponent } from './Components/Vista/Eventos/Votacion/modo-presentacion/modo-presentacion.component';
import { HomeComponent } from './Components/Home/home/home.component';
import { RegistroComponent } from './Components/Vista/Eventos/Votacion/registro/registro.component';
import { EmitirVotacionComponent } from './Components/Vista/Eventos/Votacion/emitir-votacion/emitir-votacion.component';
import { LoginBComponent } from './Components/Login/login-b/login-b.component';
import { ValidarVotanteComponent } from './Components/Vista/Eventos/Votacion/validar-votante/validar-votante.component';
//import { ImageUploadModule } from "angular2-image-upload";
import { RegistroGeneralComponent } from './Components/Vista/Registro/registro-general/registro-general.component';
import { MaquinaDialogComponent } from './Components/Vista/MisDialogs/maquina-dialog/maquina-dialog.component';
import { EliminarUsuarioDialogComponent } from './Components/Vista/MisDialogs/eliminar-usuario-dialog/eliminar-usuario-dialog.component';
import { AdministarUsuariosComponent } from './Components/Vista/Usuarios/administar-usuarios/administar-usuarios.component';
import { EliminarAdminDialogComponent } from './Components/Vista/MisDialogs/eliminar-admin-dialog/eliminar-admin-dialog.component';
import { AddAdminDialogComponent } from './Components/Vista/MisDialogs/add-admin-dialog/add-admin-dialog.component';
import { InfoAdministradorDialogComponent } from './Components/Vista/MisDialogs/info-administrador-dialog/info-administrador-dialog.component';
import { EliminarEventoDialogComponent } from './Components/Vista/MisDialogs/eliminar-evento-dialog/eliminar-evento-dialog.component';
import { CambiarPasswordDialogComponent } from './Components/Vista/MisDialogs/cambiar-password-dialog/cambiar-password-dialog.component';
import { ErrorLogoutComponent } from './Components/Errores/error-logout/error-logout.component';
import { TerminarEventoDialogComponent } from "./Components/Vista/MisDialogs/terminar-evento-dialog/terminar-evento-dialog.component";
import { ImportRegistrosDialogComponent } from "./Components/Vista/MisDialogs/import-registros-dialog/import-registros-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginAComponent,
    MenuSidenavComponent,
    PrincipalComponent,
    InformacionComponent,
    ResumenVotacionComponent,
    CrearEditarEventoComponent,
    EditarEventoComponent,
    ModoPresentacionComponent,
    HomeComponent,
    RegistroComponent,
    EmitirVotacionComponent,
    LoginBComponent,
    ValidarVotanteComponent,
    RegistroGeneralComponent,
    MaquinaDialogComponent,
    EliminarUsuarioDialogComponent,
    AdministarUsuariosComponent,
    EliminarAdminDialogComponent,
    AddAdminDialogComponent,
    InfoAdministradorDialogComponent,
    EliminarEventoDialogComponent,
    CambiarPasswordDialogComponent,
    ErrorLogoutComponent,
    TerminarEventoDialogComponent,
    ImportRegistrosDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //ImageUploadModule.forRoot(),
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  entryComponents:[
    MaquinaDialogComponent,
    EliminarUsuarioDialogComponent,
    EliminarAdminDialogComponent,
    AddAdminDialogComponent,
    InfoAdministradorDialogComponent,
    EliminarEventoDialogComponent,
    CambiarPasswordDialogComponent,
    TerminarEventoDialogComponent,
    ImportRegistrosDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
