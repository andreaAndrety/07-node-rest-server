require('./config/config');


const express = require('express');

const app = express();

// cargar las librerias para la conexion a la base de datos mongobd
const mongoose = require('mongoose');

//este es para procesar la peticiones post y poderlas leer facilmente
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//vamos a llamar el archivo de usuario para poder usarlo

app.use(require('./rutas/usuario'));


// mongoose.connect(process.env.URLDB, { useNewUrlParser: true
// , useCreateIndex: true })
//     .then(() => {
//         //if (err) throw err;
//         console.log("Base de datos online")
//     }).catch(err ){}


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log("Base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto 3000');
});