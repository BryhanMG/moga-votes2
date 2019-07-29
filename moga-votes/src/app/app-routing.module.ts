import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginAComponent} from 'src/app/Components/Login/login-a/login-a.component';
import {HomeComponent} from 'src/app/Components/Home/home/home.component';
import {MenuSidenavComponent} from 'src/app/Components/Home/menu-sidenav/menu-sidenav.component';
import {PrincipalComponent} from 'src/app/Components/Vista/Eventos/principal/principal.component';
import {InformacionComponent} from 'src/app/Components/Vista/Eventos/Votacion/informacion/informacion.component';
import {ResumenVotacionComponent} from 'src/app/Components/Vista/Eventos/Votacion/resumen-votacion/resumen-votacion.component';
import {CrearEditarEventoComponent} from 'src/app/Components/Vista/Eventos/Votacion/crear-editar-evento/crear-editar-evento.component';
import {EditarEventoComponent} from 'src/app/Components/Vista/Eventos/Votacion/editar-evento/editar-evento.component';
import {ModoPresentacionComponent} from 'src/app/Components/Vista/Eventos/Votacion/modo-presentacion/modo-presentacion.component';
import {RegistroComponent} from 'src/app/Components/Vista/Eventos/Votacion/registro/registro.component';
import {EmitirVotacionComponent} from 'src/app/Components/Vista//Eventos/Votacion/emitir-votacion/emitir-votacion.component';
import {LoginBComponent} from 'src/app/Components/Login/login-b/login-b.component';
import {ValidarVotanteComponent} from 'src/app/Components/Vista/Eventos/Votacion/validar-votante/validar-votante.component'
import {RegistroGeneralComponent } from "src/app/Components/Vista/Registro/registro-general/registro-general.component";
import { AdministarUsuariosComponent } from './Components/Vista/Usuarios/administar-usuarios/administar-usuarios.component';
import { ErrorLogoutComponent } from './Components/Errores/error-logout/error-logout.component';


const routes: Routes = [
  {path: 'login', component: LoginAComponent},
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: 'moga', component: MenuSidenavComponent, 
    children:[
      {path: '', component: HomeComponent},
      //{path: 'eventos', component: PrincipalComponent},
      {path: 'eventos', component: InformacionComponent},
      {path: 'resumen-votacion/:id', component: ResumenVotacionComponent},
      {path: 'registro', component: RegistroGeneralComponent},
      {path: 'usuarios', component: AdministarUsuariosComponent},
    ]},
  {path: 'ceevento', component: CrearEditarEventoComponent},
  {path: 'editar-evento/:id/:op', component: EditarEventoComponent},  
  {path: 'presentacion/:id/:idR', component: ModoPresentacionComponent},
  {path: 'registro_v/:id', component: RegistroComponent},
  {path: 'emisionVoto/:id/:no', component: EmitirVotacionComponent},
  {path: 'loginVotacion', component: LoginBComponent},
  {path: 'validarVotante/:id', component: ValidarVotanteComponent},
  {path: 'error-logout', component: ErrorLogoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
