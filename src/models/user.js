const mongoose = require ("mongoose")

const userSchema = mongoose.Schema({
    nombre:{
        type:String,
        required: true
    }, 
    dia:{
        type:Number,
        required: true
    },
    mes:{
        type:Number,
        required: true
    },
    año:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    contraseña:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)