const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');
const _ = require('underscore');
let app = express();
//mostrar todas las categorias

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({ estado: true }, 'nombre').exec((err, categorias) => {
        if (err) {

            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias

        });
    });
});
//mostrar la categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {

            res.status(400).json({
                ok: false,
                err
            });
        }
        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'categoria no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            categoria

        });
    });

});


//crear una  categoria
//regresa la nueva categoria
app.post('/categoria/', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {

            res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
});
//actualizar esa categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body[
    //'nombre']);
    let cambiaNombre = { nombre: body.nombre }

    Categoria.findByIdAndUpdate(id, cambiaNombre, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (categoriaDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});
//solo un administrador puede borrar la categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { estado: false }
    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {
        if (err) {


        }
        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                error: { message: 'categoria no encontrado' }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        })

    });
});

module.exports = app;