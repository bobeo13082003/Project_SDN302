const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/notification.controller');
const authorization = require('../../../../middleware/authorization.middleware');

router.get('/get-notification', authorization.Authorization, controller.getNotification)
router.patch('/read-notification', authorization.Authorization, controller.readNotification)
router.delete('/delete-notification', authorization.Authorization, controller.deleteNotification)


module.exports = router;



