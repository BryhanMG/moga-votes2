import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { BlockchainService } from 'src/app/Servicios/blockchain.service'
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Servicios/login.service';
import { UserService } from 'src/app/Servicios/user.service';
import { User } from 'src/app/Modelo/user';
import { RelojService } from 'src/app/Servicios/reloj.service';


@Component({
  selector: 'app-login-a',
  templateUrl: './login-a.component.html',
  styleUrls: ['./login-a.component.css']
})
export class LoginAComponent implements OnInit, OnDestroy {
  userLogged: User;
  mensaje: String;
  formGroup= new FormGroup({
    idUser: new FormControl(''),
    password: new FormControl('')
  });

  //Temporizadores
  private r1Subsciption;

  constructor(private _formBuilder: FormBuilder,
    private blockchainService: BlockchainService,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private reloj: RelojService,) 
    { 
      this.r1Subsciption = this.reloj.timeSecondSession.subscribe((now: Date) => {
        //console.log("Estamos aqui")
        this.userLogged = this.userService.getUserLoggedIn();
        if (this.userLogged) {
          this.router.navigateByUrl('/moga');
        }
      });

    }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      idUser: ['', Validators.required],
      password: ['', Validators.required]
    });  
   
    this.userLogged = this.userService.getUserLoggedIn();
    if (this.userLogged) {
      this.router.navigateByUrl('/moga');
    }
  }
  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }
  

  login(){
    //console.log("Hola mundo");
    if (this.formGroup.valid) {
      this.loginService.getAdmin(this.formGroup.get('idUser').value, this.formGroup.get('password').value)
      .subscribe(res => {
        var cuenta = res[0] as Object;
        //console.log(cuenta);
        if (cuenta) {
          //console.log("Secion iniciada para ", this.usuario);  
          let u: User = {username: cuenta['_id'], tipo: cuenta['rol']};
          this.userService.setUserLoggedIn(u);
          this.router.navigateByUrl('/moga');
          this.mensaje = null;
        }else{
          //console.log("Usuario o contraseña incorrectos.");
          this.mensaje = "Usuario o contraseña incorrectos.";
        }
        
      });  
    }else{
      this.mensaje = "Campos vacíos.";
    }
    
  }
  

}
