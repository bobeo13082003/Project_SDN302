const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId:String,
    message:String,
    isRead:{
        type:Boolean,
        default:false
    },

}, {
    timestamps: true
})

const Notification = mongoose.model("Notification", notificationSchema, 'notification');

module.exports  = Notification;