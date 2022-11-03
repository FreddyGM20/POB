const express = require("express")
const followers = require("../models/followers")
const followersSchema = require("../models/followers")
const userSchema = require("../models/user")
const router = express.Router()

//crear un vinculo
router.post('/followers', async (req, res) => {
  const followers = await followersSchema(req.body);
  const us = await userSchema.findById(followers.seguido)
  const us1 = await userSchema.findById(followers.seguidor)
  if ((followers.seguido === undefined || followers.seguidor === undefined)) {
    res.json({ message: "Los ID's no estan definidos" })
  } else {
    if (followers.seguido.toString() === followers.seguidor.toString()) {
      res.json({ message: "Los ID's de seguidor y seguido son iguales" })
    } else {
      if (us.seguidores.includes(us1.username)) {
        res.json({ message: "El vinculo que se intenta crear ya existe" })
      } else {
        await userSchema
          .updateOne({ _id: followers.seguido }, { $addToSet: { seguidores: us1.username } })
        await userSchema
          .updateOne({ _id: followers.seguidor }, { $addToSet: { seguidos: us.username } })
        await followers
          .save()
          .then((data) => res.json(data))
          .catch((error) => res.json({ message: error }));
      }
    }
  }

})

// Obtener un usuario en especifico seguidores
router.get("/followers/:id", async (req, res) => {
  const { id } = req.params;
  const user = await userSchema.findById(id)
  if (user.seguidores.length === 0) {
    res.json({ message: "Este usuario no tiene ningun seguidor" })
  } else {
    console.log(user)
    res.json(`Seguidores de ${user.nombre} (${user.username}): ${user.seguidores}`)
  }
});

// Obtener un usuario en especifico seguido
router.get("/followed/:id", async (req, res) => {
  const { id } = req.params;
  const user = await userSchema.findById(id)
  if (user.seguidos.length === 0) {
    res.json({ message: "Este usuario no tiene ningun seguidor" })
  } else {
    console.log(user)
    res.json(`Seguidores de ${user.nombre} (${user.username}): ${user.seguidos}`)
  }
});

// Borrar un usuario en especifico
router.delete("/followers/:seguido/:seguidor", async (req, res) => {
  const fseguido = req.params.seguido
  const fseguidor = req.params.seguidor
  if (fseguido.length !== 24) {
    res.json({ message: "El ID de seguido es invalido" })
  } else {
    if (fseguidor.length !== 24) {
      res.json({ message: "El ID de seguidor es invalido" })
    } else {
      const us = await userSchema.findById(fseguido)
      const us1 = await userSchema.findById(fseguidor)
      if ((fseguido === undefined || fseguidor === undefined)) {
        res.json({ message: "Los ID's no estan definidos" })
      } else {
        if (fseguido === fseguidor) {
          res.json({ message: "Los ID's de seguidor y seguido son iguales" })
        } else {
          if (!us1.seguidos.includes(us.username)) {
            res.json({ message: "El vinculo que se intenta borrar no existe" })
          } else {
            await userSchema
              .updateOne({ _id: fseguido }, { $pull: { seguidores: us1.username } })
            await userSchema
              .updateOne({ _id: fseguidor }, { $pull: { seguidos: us.username } })
            await followers
              .remove({ seguidor: fseguidor, seguido: fseguido })
              .then((data) => res.json(data))
              .catch((error) => res.json({ message: error }));
          }
        }
      }
    }
  }
});


module.exports = router