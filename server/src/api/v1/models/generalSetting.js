const mongoose = require("mongoose");

const generalSettingSchema = new mongoose.Schema({
    email:String,
    nameApp:String,
    image:String,
}, { timestamps: true });

const GeneralSetting = mongoose.model("GeneralSetting", generalSettingSchema, "general-settings");

module.exports = GeneralSetting;

