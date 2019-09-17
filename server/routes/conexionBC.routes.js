const express = require('express');
const router = express.Router();

const ConexionBC = require('../controllers/conexionBC.controller')

router.get('/get/', ConexionBC.getConexionBC);
router.post('/create/', ConexionBC.postConexionBC);
router.put('/update/:id', ConexionBC.updateConexionBC);

module.exports = router;