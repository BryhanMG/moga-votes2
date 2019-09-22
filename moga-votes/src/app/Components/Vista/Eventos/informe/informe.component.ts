import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { EventoVotacion } from 'src/app/Modelo/eventoVotacion';
import { ActivatedRoute } from '@angular/router';
import { Candidato } from 'src/app/Modelo/candidato';
import { SubUsuario } from 'src/app/Modelo/crearEdit';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/usuario';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { User } from 'src/app/Modelo/user';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  @ViewChild('informe', {static: true}) informe: ElementRef;
  userLogged: User;

  entrada: String;
  lugar: String = "----------";

  evento= new EventoVotacion();
  idEvento: string;
  roles =[];
  candidatos= [];
  fecha = new Date();
  fechaA = new Date();
  constructor(private eventoService: VotacionService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private userService: UserService,) {
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.getEvento(this.idEvento);

   }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();

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

    var logo = new Image();
    logo.src = '../../../../../assets/imgs/MOGA_votes_logo.png';
    //console.log(logo);
    doc.addImage(logo, 'png', 0.7, 0.7, 2, 1);
    doc.setFontSize(12);
    var fe = this.lugar+', fecha del evento '+this.fecha.getDate()+' de '+this.obtenerMes(this.fecha.getMonth())+' del '+this.fecha.getFullYear();
    var fa = null;
    var fb = null;
    //console.log(fe.length);
    //console.log(fe.charAt(36));
    if (fe.charAt(36) != ' ') {
      if (fe.charAt(35) === ' ') {//forma 'de a'
        fa = fe.substring(0, 36);
        fb = fe.substring(36);  
      }else if (fe.charAt(35) != ' ') {//forma 'agosto '
        var n = 0;
        for (let i = 37; i < fe.length; i++) {
          if (fe.charAt(i) === ' ') {
            break;
          }
          n++;
        }
        fa = fe.substring(0, 37+n);
        fb = fe.substring(38+n);
      }
    }else{
      fa = fe.substring(0, 37);
      fb = fe.substring(37);
    }
    //console.log(fa);
    //console.log(fb);
    //console.log(fe.substring(0, 37));
    doc.text(fa, 4.7, 0.7);
    doc.text(fb, 4.7, 0.9);

    doc.text('Este informe presenta los resultados del evento.', 0.7, 2);
    doc.setFontSize(10);
    doc.text('Código del evento: '+this.idEvento, 0.7, 2.4);
    doc.text('Nombre del evento: '+this.evento.nombre_ev, 0.7, 2.7);
    doc.text('Fecha y hora de inicio: '+this.evento.fecha_i.substring(0, 10)+' ---- '+this.evento.fecha_i.substring(11, 16)+' Hrs.', 0.7, 3);
    doc.text('Fecha y hora de finalización: '+this.evento.fecha_f.substring(0, 10)+' ---- '+this.evento.fecha_f.substring(11, 16)+' Hrs.', 4.3, 3);

    var y = 3.5;
     
    for (const rol of this.roles) {
      doc.setFontSize(14);  
      doc.text(rol.rol, 0.7, y);
      doc.setFontSize(10);
      var candidatos = [];
      y+=0.1;
      var q= 0;
      for (const can of rol.arreglo) {
        var nombre = can.nombres+' '+can.apellidos;
        candidatos.push([can._id, nombre, can.votos]);
        q+=0.5;
      }
      doc.autoTable({
        head: [['ID', 'Nombre', 'Votos']],
        body: candidatos,
        startY: y
      });
      y+=q+0.2;
      if (y > 10) {
        y = y-10+0.7;
      }
    }

    var pageCount = doc.internal.getNumberOfPages();
    for(let i = 0; i < pageCount; i++) { 
      doc.setPage(i); 
      doc.text(0.7,10.5, 'Responsable: '+this.userLogged.username);
      doc.text(5,10.5, 'Fecha de descarga: '+this.fechaA.getDate()+' de '+this.obtenerMes(this.fechaA.getMonth())+' del '+this.fechaA.getFullYear());
      if (pageCount > 1) {
        doc.text(4.2,10.7, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);  
      }
    }

    doc.save('a4.pdf');
  }
  
  /*
  descargarPDF(){
    let doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [11, 8.5]
    });
    
    const id = this.idEvento;
    
    var options = {
      pagesplit: true
    };

    doc.addHTML(this.informe.nativeElement, options, function() {
      doc.save('informe_'+id+'.pdf');
   });
   
  }
  */
}
