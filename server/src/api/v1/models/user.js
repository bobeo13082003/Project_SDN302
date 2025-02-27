const mongoose = require('mongoose');
const randomString = require('../../../helper/generateRandom')
// Define the User model
const userSchema = new mongoose.Schema({
    email: String,
    userName: String,
    password: String,
    token: {
        default: randomString.generateString(20),
        type: String
    },
    status: {
        type: String,
        default: "active"
    },
    role: {
        type: String,
        enum: ['admin', 'user'],  
        default: 'user'           
    },
    deletedAt: Date
},
    {
        timestamps: true
    })

const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;