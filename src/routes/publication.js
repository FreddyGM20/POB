const express = require("express")
const { default: mongoose } = require("mongoose")
const publicationSchema = require("../models/publication")
const userSchema = require("../models/user")

const router = express.Router()

//crear publicacion
router.post('/publication', async (req, res) => {
  const user = await publicationSchema(req.body)
  user.likes = undefined
  const us = await userSchema.findById(user.autor)
  if (us == null || us == undefined) {
    res.json("Error al encontrar el ID del autor")
  } else {
    await user
      .save()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
    await userSchema
      .updateOne({ _id: user.autor }, {
        $push: {
          'publicaciones': {
            publicacion: user.publicacion,
            fecharea: user.fecharea,
            likes: 0,
            _id: user._id
          }
        }
      })

  }
})
// Obtener todos los usuarios
router.get("/publication", (req, res) => {
  publicationSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Obtener publicaciones de un usuario en especifico
router.get("/publication/:id", async (req, res) => {
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
        res.send(`Publicaciones de ${user.nombre} (${user.username}): \t${user.publicaciones}`)
      }
    }
  }
});

// Borrar una publicacion en especifico
router.delete("/publication/:id", async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    res.json("El ID de la publicacion es invalido")
  } else {
    const pubg = await publicationSchema.findById(id)
    if (pubg == null || pubg == undefined) {
      res.json({ message: "El ID de la publicacion no existe" })
    } else {
      const user = await userSchema.find(pubg.autor)
      await userSchema
        .updateOne({ _id: pubg.autor }, {
          $pull: {
            'publicaciones': {
              _id: id
            }
          }
        })
      await publicationSchema
        .remove({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    }
  }

});

// Actualizar información de una publicacion
router.put("/publication/:id", async (req, res) => {
  const { id } = req.params;
  const { publicacion } = req.body
  if (id.length !== 24) {
    res.json("El ID de la publicacion es invalido")
  } else {
    const pubg = await publicationSchema.findById(id)
    if (pubg == null || pubg == undefined) {
      res.json({ message: "El ID de la publicacion no existe" })
    } else {
        await userSchema
          .updateOne({"_id":pubg.autor,"publicaciones._id":pubg._id}, {
            $set: {
                "publicaciones.$.publicacion": publicacion,
            }
          })
      await publicationSchema
        .updateOne({ _id: id }, { $set: { publicacion } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    }
  }

});

module.exports = router