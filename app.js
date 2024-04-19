const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose');
const url = 'mongodb://localhost/blogDb';

const User = require('./model/usuario');
const Post = require('./model/post');
const Comentario = require('./model/comentario');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/usuario/login', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			const { username, password } = req.body;
			return User.findOne({ username, password });
		})
		.then((user) => {
			if (user) {
				res.status(200).json({
					status: 'Bienvenido',
					data: user
				});
			} else {
				res.status(401).json({
					status: 'fail',
					message: 'Credenciales incorrectas'
				});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al iniciar sesión' });
		});
});

app.post('/api/usuario/crear', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			const user = new User({
				nombre: req.body.nombre,
				username: req.body.username,
				password: req.body.password
			});

			return user.save();
		})
		.then((savedUser) => {
			res.status(200).json({
				status: 'Usuario creado',
				data: savedUser
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al crear usuario' });
		});
});

app.get('/api/usuario/obtener', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			return User.find();
		})
		.then((usuarios) => {
			res.status(200).json(usuarios);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al obtener usuarios' });
		});
});

app.post('/api/post/crearPost', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			const { titulo, descripcion, fecha, like = 0 } = req.body;
			const post = new Post({
				titulo,
				descripcion,
				fecha,
				like
			});
			return post.save();
		})
		.then((savedPost) => {
			res.status(200).json({
				status: 'Post creado',
				data: savedPost
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al crear el post' });
		});
});


app.post('/api/post/like', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            const { postId } = req.body;
            return Post.findById(postId);
        })
        .then((post) => {
            if (!post) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }
            post.like++; 
            return post.save();
        })
        .then((savedPost) => {
            res.status(200).json({
                status: 'Like dado correctamente',
                likes: savedPost.like
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al dar like' });
        });
});


app.post('/api/post/actualizarPost', (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			const { id, titulo, descripcion, fecha, like = 0 } = req.body;
			return Post.findByIdAndUpdate(
				id,
				{ titulo, descripcion, fecha, like },
				{ new: true }
			);
		})
		.then((updatedPost) => {
			res.status(200).json({
				status: 'Post editado',
				data: updatedPost
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al actualizar el post' });
		});
});

app.get('/api/post/getAllPost', (req, res) => {
	mongoose.connect(url, { useMongoClient: true }, function (err) {
		if (err) throw err;
		Post.find({}, [], { sort: { _id: -1 } }, (err, doc) => {
			if (err) throw err;
			return res.status(200).json({
				status: 'ok', //devuelve los post
				data: doc
			})
		})
	});
})


app.post('/api/comentario/crear', (req, res) => {
	const { postId, nombre, comentario } = req.body;
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			const nuevoComentario = new Comentario({ nombre, comentario });
			return nuevoComentario.save();
		})
		.then((savedComentario) => {
			return Post.findByIdAndUpdate(
				postId,
				{ $push: { comentarios: savedComentario._id } },
				{ new: true }
			);
		})
		.then((updatedPost) => {
			if (!updatedPost) {
				return res.status(404).json({
					status: 'Error',
					mensaje: 'No se encontró el post'
				});
			}
			res.status(200).json({
				status: 'Comentario creado',
				data: updatedPost
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al crear el comentario' });
		});
});

app.post('/api/comentario/getAll', (req, res) => {
	const { postId } = req.body;

	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			return Post.findById(postId)
				.populate('comentarios')
				.exec();
		})
		.then((post) => {
			if (!post) {
				return res.status(404).json({
					status: 'Error',
					mensaje: 'No se encontró el post'
				});
			}

			res.status(200).json({
				status: 'Éxito',
				data: post.comentarios
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: 'Error al obtener los comentarios' });
		});
});

app.listen(3000, () => console.log('Blog mongo correindo en servidor 3000!'))