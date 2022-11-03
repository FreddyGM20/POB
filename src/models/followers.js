const mongoose = require ("mongoose")

const seguidosSchema = mongoose.Schema({
   
    seguidor:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    seguido:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    }

})

module.exports = mongoose.model('Seguidos', seguidosSchema)