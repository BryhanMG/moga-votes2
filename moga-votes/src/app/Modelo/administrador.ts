export class Administrador{
    _id: String;
    rol: number;
    password: String;
    eventos= [];

    constructor(){
        this._id="";
        this.rol=0;
        this.password="";
        this.eventos=[]
        
    }
}