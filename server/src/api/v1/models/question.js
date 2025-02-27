const mongoose = require('mongoose');
// Define the Question model
const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    answerA: String,
    answerB: String,
    answerC: String,
    answerD: String,
    correctAnswer: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema); // Ensure this matches the model name
