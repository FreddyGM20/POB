const express = require('express')
const { default: mongoose } = require('mongoose')
require("dotenv").config()
const userRoutes = require("./routes/user.js")
const publicationRoutes = require("./routes/publication.js")
const followersRoutes = require("./routes/followers.js")
const likesRoutes = require("./routes/likes.js")

const app = express()
const port = process.env.PORT || 9000

//middlewares
app.use(express.json())
app.use('/api',userRoutes)
app.use('/api',publicationRoutes)
app.use('/api',followersRoutes)
app.use('/api',likesRoutes)


//Routes
app.get('/', (req, res) => {
res.send("Welcome to my API")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDBAtlas"))
  .catch((error) => console.error(error))

//mongodb connection
app.listen(port, () => console.log("Servidor funcionando en el puerto", port))



