const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    fechanac: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    seguidos: [{
        type: String,
        ref: 'User',
        required: false
    }],
    seguidores: [{
        type: String,
        ref: 'User',
        required: false
    }],
    publicaciones: [{
        publicacion: {
            type: String,
            required: false
        },
        fecharea: {
            type: Date,
            required: false
        },
        likes: {
            type: Number,
            required: false
        }
    }],
    likeados: [{
        publicacion: {
            type: String,
            required: false
        },
        fecharea: {
            type: Date,
            required: false
        }
    }]
})

module.exports = mongoose.model('User', userSchema)