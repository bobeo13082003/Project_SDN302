const Ads = require("../../models/ads");

module.exports.createAds = async (req, res) => {
  try {
    const newAd = new Ads(req.body);
    await newAd.save();
    res.json({ message: "Ads created successfully", code: 200 });
  } catch (error) {
    res.status(500).json({ message: "Error creating ad", error });
  }
};

module.exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ads.find();
    res.json({ code: 200, data: ads });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ads", error });
  }
};

module.exports.deleteAds = async (req, res) => {
  const { id } = req.query;
  if (id) {
    await Ads.deleteOne({ _id: id }, { deleted: true });
    res.json({ code: 200, message: "Deleted Ads Successfully" });
  } else {
    res.json({ code: 402, message: "Id Ads Not Found" });
  }
};

module.exports.updateAds = async (req, res) => {
  const { id } = req.body
  try {
    if (!id) {
      return res.status(400).json({ code: 400, message: "Ad ID is required" });
    }
    await Ads.updateOne({ _id: id }, req.body);
    res.json({ code: 200, message: "Update Ads Successfully" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "An error occurred" });
  }
};
