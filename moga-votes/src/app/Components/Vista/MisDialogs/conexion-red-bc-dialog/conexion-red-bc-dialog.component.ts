import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BlockchainService } from 'src/app/Servicios/blockchain.service';
import { ConexionBC } from "src/app/Modelo/crearEdit";

@Component({
  selector: 'app-conexion-red-bc-dialog',
  templateUrl: './conexion-red-bc-dialog.component.html',
  styleUrls: ['./conexion-red-bc-dialog.component.css']
})
export class ConexionRedBcDialogComponent implements OnInit {
  ipConexionBC= new ConexionBC();
  ip: String;

  constructor(public dialogRef: MatDialogRef<ConexionRedBcDialogComponent>,
    private blockchainService: BlockchainService,
    ) { }

  ngOnInit() {
    this.obtenerIP();  
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  obtenerIP(){
    this.blockchainService.getConexionBC()
      .subscribe(res => {
        this.ipConexionBC = res[0] as ConexionBC;
        //console.log(this.ipConexionBC);
      });
  }

  actualizarIP(){
    this.blockchainService.updateConexionBC(this.ipConexionBC._id, this.ip)
      .subscribe(res =>{
        //console.log(res);
        this.obtenerIP();
        this.ip = null;
      });
  }
  
}


