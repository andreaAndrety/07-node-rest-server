const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        unique: true,
        type: String,
        required: [true, 'el correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la constraseña es necesaria'],

    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
        required: [true, 'el rol es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);