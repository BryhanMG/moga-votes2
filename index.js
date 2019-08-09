const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const { mongoose } = require('./server/database');

const app = express();


// Settings
app.set('port', process.env.PORT || 5000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: '*'}));
//app.use(cors({origin: 'https://moga-votes.herokuapp.com/'}));
//app.use(cors({origin: 'http://localhost:4200'}));

// Routes
app.use('/api/usuarios',require('./server/routes/usuarios.routes'));
app.use('/api/eventos', require('./server/routes/eventos.routes'));
//app.use('/api/eventos_r', require('./server/routes/eventos_rp.routes'));
app.use('/api/admins', require('./server/routes/administradores.routes'));
//app.use('/api/admins_reg', require('./server/routes/administradores_reg.routes'));
app.use('/api/candidatos', require('./server/routes/condidatos.routes'));
app.use('/api/maquinas', require('./server/routes/maquinas.routes'));
//app.use('/api/actividades', require('./server/routes/actividades.routes'));
app.use('/api/imagenes', require('./server/routes/imagenes.routes'));
app.use('/api/login', require('./server/routes/login.routes'));

//Upload
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './moga-votes/src/assets/upload');
    },
    filename: (req, file, cb) =>{
        cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/getImg', (req, res) => {
     return res.send('This is the home page!');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(`Storage location is ${req.hostname}/${req.file.path}`);
    console.log(req.file);
    return res.send(req.file);
});

//PathLocationStrategy
app.use(express.static('./moga-votes/dist/moga-votes'));
app.get('/*', (req, res) => {
    res.sendFile(path.join('./moga-votes/dist/moga-votes/index.html')) 
 }); 

// Empezar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});










