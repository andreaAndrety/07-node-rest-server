const jwt = require('jsonwebtoken');

//vamos a verificar el token conla ayuda de middelwares

let verificaToken = (req, res, next) => {
    let token = req.get('autorization');
    //se recuerda que no se hace este next la aplicacion 
    //nunca va a continuar ejecutando
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

    // res.json({
    //     token: token
    // });
};

// vamos  a verificar el usuario administrador 

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};
//verifica token para imagen
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


};


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};