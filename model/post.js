const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: String, required: true },
  like: { type: Number, required: true },
  comentarios: [{ type: Schema.Types.ObjectId, ref: 'Comentario' }]
}, { collection: 'post' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;