import { Administrador } from 'src/app/Modelo/administrador';

export class Votante{
    _id: String;
    voto: String;
    maquina: String;
  }

export abstract class CrearEdit{

    obtenerFechaI(fehcaF: Date, horaI: any): string{
        let fI = fehcaF;
        var fechaI : string;
        //console.log("FeI: "+fI);
        fI.setMonth(fI.getMonth()+1);
        if (fI.getMonth() < 10) {
            fechaI = fI.getFullYear()+"-0"+fI.getMonth();  
        }else{
            fechaI = fI.getFullYear()+"-"+fI.getMonth();
        }
        
        if (fI.getDate() < 10) {
            fechaI +="-0"+fI.getDate();   
        }else{
            fechaI += "-"+fI.getDate();   
        }
        
        fechaI+="T"+horaI+":00.000+00:00"
        console.log("A Fecha Inicio: "+fechaI);
        return fechaI;
    }

    obtenerFechaF(fehcaF: Date, horaF: any): string{
        let fF = fehcaF;
        var fechaF : string;
        //console.log("FeI: "+fI);
        fF.setMonth(fF.getMonth()+1);
        if (fF.getMonth() < 10) {
            fechaF = fF.getFullYear()+"-0"+fF.getMonth();  
        }else{
            fechaF = fF.getFullYear()+"-"+fF.getMonth();
        }
        
        if (fF.getDate() < 10) {
            fechaF +="-0"+fF.getDate();   
        }else{
            fechaF += "-"+fF.getDate();   
        }
        
        fechaF+="T"+horaF+":00.000Z"
        console.log("A Fecha Final: "+fechaF);
        return fechaF
    }

    //Generador de codigo aleatorio para las maquinas
    generadorClave(){
        var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
        var contraseña = "";
        for (let i = 0; i < 10; i++) {
        contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
        }
        return contraseña;
    }
}

export class nuevoRol{
    id: String;
    rol: String;
    descripcion: String; 
    candidatos= [];
    constructor(){
      this.id = '';
      this.rol = '';
      this.descripcion = '';
    }
}

export class Responsable{
    nombres: String;
    apellidos: String;
    estado: String;
    administrador: Administrador;
  
    constructor(){
      this.nombres = "";
      this.apellidos = "";
      this.estado = "remove_circle_outline";    
    }
  }

export class ResponsableE{
    nombres: String;
    apellidos: String;
    estado: String;
    change: boolean;
    administrador: Administrador;
    
        constructor(){
        this.nombres = "";
        this.apellidos = "";
        this.change = false;
        this.estado = "remove_circle_outline";    
        }
}

export class SubUsuario{
    _id: String;
    votos: number;
    imagen: String;
    constructor(){
    }
  }
  

export class nuevoCandidato{
id_ev: String;
rol: String;
descripcion: String;
candidatos: Array<Object>;

constructor(id_ev: String, rol: String, descripcion: String, candidatos: Array<Object>){
    this.id_ev = id_ev;
    this.rol= rol;
    this.descripcion=descripcion;
    this.candidatos = candidatos;
    
}
}


