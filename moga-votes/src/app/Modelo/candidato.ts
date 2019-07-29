export class Candidato{
    _id: String;
    id_ev: String;
    rol: String;
    descripcion: String;
    candidatos: Array<Object>;
    nuevo: boolean;

    constructor(){
        this._id = '';
        this.id_ev = '';
        this.rol= '';
        this.descripcion='';
        this.candidatos = [];
        this.nuevo = false;
    }
}