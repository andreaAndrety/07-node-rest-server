require('./config/config');
//express nos ayuda a crear nuestro servidor 
const express = require('express');
const app = express();
//este es para procesar la peticiones post y poderlas leer facilmente
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//
app.get('/', function(req, res) {
    res.json('Hello World');
});
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        });
    } else {

        res.json({
            persona: body
        });
    }


});
app.put('/usuario/:id', function(req, res) {
    let id = req.param.id;

    req.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto 3000');
});