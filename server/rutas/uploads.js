const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: ' no tiene archivos para cargar'
                }
            });
    }
    //validas tipo
    let tipoValido = ['usuarios', 'productos'];

    if (tipoValido.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son ' + tipoValido.join(',')
            }
        })
    }



    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    console.log(extension);
    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jepg'];
    console.log(extension);
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' Las extensiones permitidas son ' + extensionesValidas.join(',')
            }
        })
    }
    console.log(extension);
    //cambiar nombre archivo
    let nombreArchivoNuevo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoNuevo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui la imagen ya se guardo
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoNuevo);
        }
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivoNuevo);
        }

        //como me voy a pasar como referencia el res , ya no lo necesito aqui
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida corectamente'

        // });
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
};

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(tipo, img) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;