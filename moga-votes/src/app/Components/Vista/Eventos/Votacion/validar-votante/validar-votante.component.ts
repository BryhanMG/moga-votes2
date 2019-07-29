import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {RelojService} from 'src/app/Servicios/reloj.service';
import { Observable } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { MaquinaVotacionService } from 'src/app/Servicios/maquina-votacion.service';
import { BlockchainService } from 'src/app/Servicios/blockchain.service';

import { Usuario } from 'src/app/Modelo/usuario';
import { MaquinaVotacion } from 'src/app/Modelo/maquinaVotacion';
import { Votante } from 'src/app/Modelo/crearEdit';
import { Candidato } from "src/app/Modelo/candidato";
import { MaquinaDialogComponent } from '../../../MisDialogs/maquina-dialog/maquina-dialog.component';

@Component({
  selector: 'app-validar-votante',
  templateUrl: './validar-votante.component.html',
  styleUrls: ['./validar-votante.component.css']
})
export class ValidarVotanteComponent implements OnInit, OnDestroy {
  
  maquinas: MaquinaVotacion[];
  votante: Votante;
  
  idEvento: String;
  codigo: String;

  formGroup= new FormGroup({
    idU: new FormControl(''),
    nombre: new FormControl(''),
    correo: new FormControl(''),
    noMaquina: new FormControl(''),
    estado: new FormControl('')
  });

  //Temporizadores
  private r1Subsciption;
  
  constructor(private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private votacionService: VotacionService,
    private maquinaVotacionService: MaquinaVotacionService,
    private blockchainService: BlockchainService,
    private snackBar: MatSnackBar,
    private reloj: RelojService,
    public dialog: MatDialog
    ) { 
      this.r1Subsciption = this.reloj.timeSecond.subscribe((now: Date) => {
        //console.log("tiempo", now);
        this.getMaquinas();
      });  

    }

  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.formGroup = this._formBuilder.group({
      idU: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      noMaquina: ['', Validators.required],
      estado: ['', Validators.required]
    }); 
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }

  getMaquinas(){
    this.maquinaVotacionService.getMaquinas(this.idEvento)
      .subscribe(res => {
        this.maquinas = res as MaquinaVotacion[];
        //console.log(this.maquinas);
      });
  }

  getVotante(){
    this.votacionService.getVotante(this.idEvento, this.codigo)
      .subscribe(res => {
        this.votante = res['votantes'][0] as Votante;
        //console.log(this.votante);
        if (this.votante != null) {
          this.getUsuario(this.votante._id);
        }else{
          this.openSnackBar("Votante no registrado.", "Cerrar");
          this.limpiarinformacion();
        }
        
      });
  }

  getUsuario(id: String){
    this.usuarioService.getUsuario(id)
      .subscribe(res =>{
        this.usuarioService.usuario = res as Usuario;
        //console.log(res);
        this.formGroup.get('idU').setValue(this.usuarioService.usuario._id);
        this.formGroup.get('nombre').setValue(this.usuarioService.usuario.nombres+' '+this.usuarioService.usuario.apellidos);
        this.formGroup.get('correo').setValue(this.usuarioService.usuario.correo);
        this.formGroup.get('noMaquina').setValue(this.votante.maquina);
        this.asignarEstado();
        this.codigo = null;
      });
  }

  validarVotante(){
    if (this.formGroup.get('estado').value === "No emitido") {
      let vo = [{votantes: [this.votante]}];
      //console.log(vo);
      if (this.votante.maquina === "A") {
        this.openSnackBar("Votante ya autenticado", "Cerrar");
      }else{
        this.votacionService.deleteVotante(this.idEvento, vo)
          .subscribe(res => {
            //console.log(res);
            this.votante.maquina = "A";
            let vo = [{votantes: [this.votante]}];
            //console.log(vo);
            this.votacionService.addVotante
            this.votacionService.addVotante(this.idEvento, vo)
              .subscribe(res =>{
                //console.log(res);
                this.openSnackBar("Votante autenticado", "Cerrar");
                this.limpiarinformacion();
                //this.addVotoVotante();
                
              });
            
            
          });
      }
    }else{
      this.openSnackBar("No se puede asignar, voto emitido.", "Cerrar");
      
    }
    

  }

  asignarEstado(){
    if (this.votante.voto == "NE") {
      this.formGroup.get('estado').setValue("No emitido");
    }else{
      this.formGroup.get('estado').setValue("Emitido");
    }
  }

  asignarEstadoMaquina(estado: String){
    if (estado == "A") {
      return "Disponible";
    }else if (estado == "B") {
      return "Inactiva";
    }else{
      return "En uso"
    }
  }
/*
  addVotoVotante(){
    this.blockchainService.postVotante(this.idU, this.nombre)
      .subscribe(res => {
        console.log(res);
      });
    

    this.votacionService.getCandidatos(this.idEvento.toString())
      .subscribe(res =>{
        this.votacionService.candidatos = res as Candidato[];
        //console.log(this.votacionService.candidatos)
        for (const can of this.votacionService.candidatos) {
          this.blockchainService.postVoto(this.idU, this.idEvento, can.rol, can._id)
            .subscribe(res => {
              console.log(res);
              this.limpiarinformacion();
            });    
        }
        
      });
  }*/

  limpiarinformacion(){
    this.formGroup.get('idU').setValue(null);
    this.formGroup.get('nombre').setValue(null);
    this.formGroup.get('correo').setValue(null);
    this.formGroup.get('noMaquina').setValue(null);
    this.formGroup.get('estado').setValue(null);
  }

  
  openDialog(ma: String, pass: String): void {
    const dialogRef = this.dialog.open(MaquinaDialogComponent, {
      data: {maquina: ma, password: pass}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}


