const mongoose = require ("mongoose")

const likesSchema = mongoose.Schema({
   
    like:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    publicacion:{
        type: mongoose.Types.ObjectId,
        ref:'Publication',
        required: true
    }

})

module.exports = mongoose.model('Likes', likesSchema)