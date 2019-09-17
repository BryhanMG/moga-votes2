const ConexionBC = require('../models/conexionBC');

const conexionBCController = {};
//Obtener todas las imagenes
conexionBCController.getConexionBC = async (req, res) => {
    const conexionBC = await ConexionBC.find();
    res.json(conexionBC);
};

//Crear un documento con informacion de la imagen
conexionBCController.postConexionBC = async(req, res)=>{
    const conexionBC = new ConexionBC(req.body);
    //console.log(conexionBC);
    await conexionBC.save();
    res.json({
        'status': 'Conexion guradada'
    });
};

//Eliminar una imagen
conexionBCController.updateConexionBC = async (req, res) => {
    const {id} = req.params;
    const conexionBC = {
        ip: req.body.ip,        
    };
    await ConexionBC.findByIdAndUpdate(id, {$set: conexionBC}, {new: true});
    res.json({status: 'Conexion actualizada'});
};



module.exports = conexionBCController;