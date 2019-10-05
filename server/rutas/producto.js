const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');
const _ = require('underscore');
let app = express();

app.get('/producto', verificaToken, (req, res) => {


    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {

                res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos

            });
        });
});
//mostrar la producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) => {
        if (err) {

            res.status(400).json({
                ok: false,
                err
            });
        }
        if (producto === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'producto no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            producto

        });
    });

});
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    //vamos a crear una expresion regular para buscar como si fuera un a like '%%'

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {

                res.status(400).json({
                    ok: false,
                    err
                });
            }
            // if (producto === null) {
            //     return res.status(400).json({
            //         ok: false,
            //         error: {
            //             message: 'producto no encontrado'
            //         }
            //     })
            // }
            res.json({
                ok: true,
                productos

            });
        });

});


//crear una  categoria
//regresa la nueva categoria
app.post('/producto/', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {

            res.status(500).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        })

    });
});
//actualizar esa categoria
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body[
    //'nombre']);
    let cambiaNombre = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        descripcion: body.descripcion,
        disponible: body.disponible

    }

    Producto.findByIdAndUpdate(id, cambiaNombre, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (productoDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });
});
//solo un administrador puede borrar la categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { disponible: false }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {


        }
        if (productoBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: { message: 'producto no encontrado' }
            })
        }
        res.json({
            ok: true,
            producto: productoBorrado
        })

    });
});








module.exports = app;