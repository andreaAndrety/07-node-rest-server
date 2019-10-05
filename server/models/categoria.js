const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        unique: true,
        type: String,
        required: [true, 'el nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});
categoriaSchema.methods.toJSON = function() {
    let cat = this;
    let catObject = cat.toObject();
    return catObject;
}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Categoria', categoriaSchema);