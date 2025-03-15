const mongoose = require('mongoose');
// Define the Question 
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    libraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library',

    },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',

        },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    traffic: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
}
);

module.exports = mongoose.model('Quiz', quizSchema);