const mongoose = require('mongoose')


const adsSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  image: { type: String }, 
  link: { type: String, required: true }, 
 
},{timestamps:true});


const Ads = mongoose.model("Ads", adsSchema,"ads");
module.exports = Ads
