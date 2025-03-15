const randomString = require('../../../helper/generateRandom');
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    userName: String,
    password: String,
    token:{
        default: randomString.generateString(20),
        type: String
    },
    role:{
        type: String,
        default: 'admin'
    }

},{
    timestamps: true,
})

const Admin = mongoose.model('Admin', adminSchema, 'admin');

module.exports = Admin;