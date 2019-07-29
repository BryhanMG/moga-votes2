export class EmitirVoto{
    voto = "resource:org.prueba.Voto#";
    candidato = "resource:org.prueba.Candidato#";
}

export class CandidatoBC{
    id: string;
    id_evento: String;
    candidato: String;
    votos: number;

    constructor(id: string, id_evento: String, candidato: String){
        this.id = id;
        this.candidato = candidato;
        this.id_evento = id_evento;
        this.votos = 0;
    }
}

export class Voto{
    votoId: String;
    candidato: String;
    propietario = "resource:org.prueba.Votante#";

    constructor(votoId: String, candidato: String, propietario: String){
        this.votoId = votoId;
        this.candidato = candidato;
        this.propietario+= propietario;
        
    }
}