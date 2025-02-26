const mongoose = require('mongoose');

const latestQuiz = new mongoose.Schema({
    userID: String,
    quizIDs: {
        type: Array,
        default: []
    },
    "timeOut": {
        type: Date,
        expires: 60 * 60 * 24 * 10
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('LatestQuiz', latestQuiz);