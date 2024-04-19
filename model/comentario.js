const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
  nombre: { type: String, required: true },
  comentario: { type: String, required: true }
}, { collection : 'post' });

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = Comentario;