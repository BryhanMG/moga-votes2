import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-imagen-dialog',
  templateUrl: './eliminar-imagen-dialog.component.html',
  styleUrls: ['./eliminar-imagen-dialog.component.css']
})
export class EliminarImagenDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EliminarImagenDialogComponent>
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSiClick(): void {
    this.dialogRef.close(true);
  }
}
