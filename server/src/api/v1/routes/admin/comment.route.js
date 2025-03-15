const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/comment.controller');


router.post('/AllComment', controller.getAllComment)
router.delete('/admin/:id', controller.deleteComment)



module.exports = router;