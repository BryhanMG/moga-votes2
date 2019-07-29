import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-maquina-dialog',
  templateUrl: './maquina-dialog.component.html',
  styleUrls: ['./maquina-dialog.component.css']
})
export class MaquinaDialogComponent implements OnInit {
  maquina: String;
  password: String;
  showP= false;
  

  constructor( public dialogRef: MatDialogRef<MaquinaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    //console.log(this.data);
    this.maquina = this.data['maquina'];
    this.password = this.data['password'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showHidePassword(){
    this.showP = !this.showP;
  }

}
