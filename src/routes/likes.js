const express = require("express")
const likesSchema = require("../models/likes")
const userSchema = require("../models/user")
const publicationSchema = require("../models/publication")
const likes = require("../models/likes")
const { default: mongoose } = require("mongoose")
const router = express.Router()

//crear publicacion
router.post('/likes', async (req, res) => {
    const like = await likesSchema(req.body)
    const pubg = await publicationSchema.findById({ _id: like.publicacion })
    if ((like.like).toString().length !== 24) {
        res.json("Error de ID like")
    } else {
        if ((like.publicacion).toString().length !== 24) {
            res.json("Error de ID publicacion")
        } else {
            if (pubg == null || pubg == undefined) {
                res.json("Error al encontrar el ID de la publicacion")
            } else {
                if (pubg.likes.includes(like.like)) {
                    res.json("Ya se ha dado like")
                } else {
                    await like
                        .save()
                        .then((data) => res.json(data))
                        .catch((error) => res.json({ message: error }));

                    const temp = (like.like).toString()
                    await publicationSchema
                        .updateOne({ _id: like.publicacion }, { $addToSet: { likes: temp } })

                    await userSchema
                        .updateOne({ _id: pubg.autor }, {
                            $set: {
                                'publicaciones': {
                                    publicacion: pubg.publicacion,
                                    fecharea: pubg.fecharea,
                                    likes: (pubg.likes.length + 1),
                                    autor: pubg.autor,
                                    _id: pubg._id
                                }
                            }
                        })
                    await userSchema
                        .updateOne({ _id: like.like }, {
                            $push: {
                                "likeados": {
                                    publicacion: pubg.publicacion,
                                    fecharea: pubg.fecharea,
                                    autor: pubg.autor,
                                    _id: pubg._id
                                }
                            }
                        })
                }
            }
        }
    }
})
// Obtener todos los usuarios
router.get("/likes", (req, res) => {
    likesSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener likes de un usuario en especifico
router.get("/like/:id", async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24) {
        res.json("El ID de la publicacion es invalido")
    } else {
        const user = await userSchema.findById(id)
        if (user == null || user == undefined) {
            res.json({ message: "El ID del usuario no existe" })
        } else {
            if (user.publicaciones.length === 0) {
                res.json({ message: "Este usuario no tiene ninguna publicacion" })
            } else {
                res.send(`Publicaciones de ${user.nombre} (${user.username}): \t${user.likeados}`)
            }
        }
    }
});

// Borrar una like en especifico
router.delete("/likes/:id/:publicacion", async (req, res) => {
    const id = req.params;
    const id1 = mongoose.Types.ObjectId(id.id)
    const pub = mongoose.Types.ObjectId(id.publicacion)
    if (id.id.length !== 24) {
        res.json("El ID del like es invalido")
    } else {
        if (id.publicacion.length !== 24) {
            res.json("El ID de la publicacion es invalido")
        } else {
            temp = id1.toString()
            const pubg = await publicationSchema.findById({ _id: pub })
            if (pubg == null || pubg == undefined) {
                res.json({ message: "El ID del like no existe" })
            } else {
                    await userSchema
                        .updateOne({ _id: pubg.autor }, {
                            $set: {
                                'publicaciones': {
                                    publicacion: pubg.publicacion,
                                    fecharea: pubg.fecharea,
                                    likes: (pubg.likes.length - 1),
                                    _id: pubg._id
                                }
                            }
                        })

                    await userSchema
                        .updateOne({ _id: id.id }, {$pull: {'likeados': {_id: id.publicacion}}})

                    await publicationSchema
                        .updateOne({ _id: id.publicacion }, {$pullAll: { likes: [id.id] }})

                    await likesSchema
                        .remove({ like: id.id , publicacion:id.publicacion})
                        .then((data) => res.json(data))
                        .catch((error) => res.json({ message: error }));
            }

        }
    }

});


module.exports = router