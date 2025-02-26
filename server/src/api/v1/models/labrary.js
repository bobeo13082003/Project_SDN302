const mongoose = require('mongoose');

const labrarySchema = new mongoose.Schema({
    userId:String,
    quizId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    ],
    deleted:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
})

const Labrary = mongoose.model("Labrary", labrarySchema, 'labrary');

module.exports = Labrary;