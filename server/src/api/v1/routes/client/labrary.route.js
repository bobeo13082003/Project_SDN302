const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/labrary.controller');
const authorization = require('../../../../middleware/authorization.middleware')

router.post('/add-labrary', authorization.Authorization, controller.addLabrary)
router.get('/get-all', authorization.Authorization, controller.getLabrary)



module.exports = router;
