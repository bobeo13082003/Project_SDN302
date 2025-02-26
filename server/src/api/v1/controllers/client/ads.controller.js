const Ads = require("../models/ads");


module.exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ads.find();
    res.json({ code: 200, data: ads });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ads", error });
  }
};
