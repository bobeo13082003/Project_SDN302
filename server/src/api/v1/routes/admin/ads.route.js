const express = require("express");
const router = express.Router();
const controller = require('../../controllers/admin/ads.controller')
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadCloud = require("../../../../middleware/uploadCloud");
const authorization = require("../../../../middleware/authorization.middleware");

router.post("/add-ads",
  authorization.AuthorizationAdmin,
  upload.single("image"),
  uploadCloud.uploadCloud,
  controller.createAds
);
router.get("/get-ads", authorization.AuthorizationAdmin, controller.getAllAds);
router.delete('/deleteAds', authorization.AuthorizationAdmin, controller.deleteAds);
router.patch(
  "/editAds",
  authorization.AuthorizationAdmin,
  upload.single("image"),
  uploadCloud.uploadCloud,
  controller.updateAds
);
module.exports = router;