const express = require("express");
const controller = require("../../controllers/admin/ads.controller");

const router = express.Router();

router.get("/ads", controller.getAllAds);

module.exports = router;
