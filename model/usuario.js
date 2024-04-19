const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const usuarioSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String }
}, { collection : 'user' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;