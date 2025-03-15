const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/comment.controller');
const authorization = require("../../../../middleware/authorization.middleware");

router.post('/AllComment', authorization.AuthorizationAdmin, controller.getAllComment)
router.delete('/admin/:id', authorization.AuthorizationAdmin, controller.deleteComment)



module.exports = router;