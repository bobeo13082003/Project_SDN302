const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const controller = require('../../controllers/admin/generalSetting.controller')
const upload = multer({ storage: storage });
const uploadCloud = require('../../../../middleware/uploadCloud');
const authenticate = require("../../../../middleware/authorization.middleware");

router.get('/',
    authenticate.AuthorizationAdmin,
    upload.single('image'),
    uploadCloud.uploadCloud,
    controller.generalSetting);

router.post('/edit',
    authenticate.AuthorizationAdmin,
    upload.single('image'),
    uploadCloud.uploadCloud,
    controller.editGeneralSetting);

module.exports = router;