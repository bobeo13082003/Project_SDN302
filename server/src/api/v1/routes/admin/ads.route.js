const express = require("express");
const router = express.Router();
const controller = require('../../controllers/admin/ads.controller')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadCloud = require("../../../../middleware/uploadCloud");
const authorization = require("../../../../middleware/authorization.middleware");

router.post("/add-ads",
  upload.single("image"),
  uploadCloud.uploadCloud,
  controller.createAds
);
router.get("/get-ads", controller.getAllAds);
router.delete('/deleteAds', controller.deleteAds);
router.patch(
  "/editAds",
  upload.single("image"),
  uploadCloud.uploadCloud,
  controller.updateAds
);
module.exports = router;