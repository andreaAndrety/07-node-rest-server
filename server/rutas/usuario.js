//express nos ayuda a crear nuestro servidor 
const express = require('express');
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


const bcrypt = require('bcryptjs');
const _ = require('underscore');


const app = express();


app.get('/', function(req, res) {
    res.json('Hello World');
});
app.get('/usuario', verificaToken, function(req, res) {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;

    let limite = req.query.limite || 5;
    limite = Number(limite)
    desde = Number(desde);;
    Usuario.find({ estado: true }, 'nombre email estado role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {

                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    conteo
                })

            })


        })

});

//insrtar registros
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });
    usuario.save((err, usuarioDB) => {
        if (err) {

            res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body[
        'nombre',
        'email',
        'img',
        'role',
        'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })

});
// app.delete('/usuario/id', function(req, res) {

//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {


//         }
//         if (usuarioBorrado === null) {
//             return res.status(400).json({
//                 ok: false,
//                 error: { message: 'usuaio no encontrado' }
//             })
//         }
//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         })

//     });

// });7
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = { estado: false }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {


        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: { message: 'usuaio no encontrado' }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    });

});

module.exports = app;