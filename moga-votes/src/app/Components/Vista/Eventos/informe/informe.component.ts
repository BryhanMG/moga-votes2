import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { ActivatedRoute } from '@angular/router';
import { Candidato } from 'src/app/Modelo/candidato';
import { SubUsuario } from 'src/app/Modelo/crearEdit';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/usuario';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  @ViewChild('informe', {static: true}) informe: ElementRef;

  entrada: String;
  lugar: String = "----------";

  evento= new EventoVotacion();
  idEvento: string;
  roles =[];
  candidatos= [];
  fecha = new Date();

  constructor(private eventoService: VotacionService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,) {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.getEvento(this.idEvento);
    
   }

  ngOnInit() {
    }

  getEvento(id: string){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        //console.log(res);
        if (res != null) {
          this.evento = res as EventoVotacion;
          this.getCandidatos();
        }
        
        //console.log(res);
      });
  }

  getCandidatos(){
    this.roles= [];
    this.eventoService.getCandidatos(this.idEvento)
      .subscribe(res =>{
        this.eventoService.candidatos = res as Candidato[];
        //console.log(res);
        for (const rol of this.eventoService.candidatos) {
          //console.log(rol);
          this.roles.push({idR: rol._id, rol: rol.rol, descripcion: rol.descripcion, arreglo: []});
          this.candidatos = [];
          for (const can of rol.candidatos) {
            //console.log(can);
            var s = can as SubUsuario;
            this.obtenerUsuario(rol.rol, s);
          }
          //this.getCandidato(rol);  
          this.fecha =  new Date(this.evento.fecha_f.toString());
        }
        
      });
  }

  obtenerUsuario(rol: String, s: SubUsuario){
    this.usuarioService.getUsuario(s._id)
          .subscribe(res =>{
            this.usuarioService.usuario = res as Usuario
            for (const r of this.roles) {
              if (r.rol === rol) {
                //console.log(r);
                r.arreglo.push({_id: this.usuarioService.usuario._id, nombres: this.usuarioService.usuario.nombres,
                  apellidos: this.usuarioService.usuario.apellidos, correo: this.usuarioService.usuario.correo, votos: s.votos});
                break;    
              }
            }
            
            //console.log(this.roles);
          });
  }

  guardarLocalidad(){
    this.lugar = this.entrada;
    this.entrada = null;
  }

  obtenerMes(op: number){
    switch (op) {
      case 1:
          return "enero"
        break;
      case 2:
          return "febrero"
        break;
      case 3:
          return "marzo"
        break;
      case 4:
          return "abril"
        break;
      case 5:
          return "mayo"
        break;
      case 6:
          return "junio"
        break;
      case 7:
          return "julio"
        break;
      case 8:
          return "agosto"
        break;
      case 9:
          return "septiembre"
        break;
      case 10:
          return "octubre"
        break;
      case 11:
          return "noviembre"
        break;
      case 12:
          return "diciembre"
        break;
      default:
        break;
    }
  }

  descargarPDF(){
    let doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [11, 8.5]
    });
    const id = this.idEvento;
    doc.addHTML(this.informe.nativeElement, function() {
      doc.save('informe_'+id+'.pdf');
   });
    
  }

}
