const mongoose = require ("mongoose")

const publicationSchema = mongoose.Schema({
    publicacion:{
        type:String,
        required: true
    }, 
    fecharea:{
        type:Date,
        required: true
    },
    autor:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    likes:[{
        type:String,
        ref:'User',
        required:false
    }]
})

module.exports = mongoose.model('Publication', publicationSchema)