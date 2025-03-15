const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/comment.controller');
const authorization = require('../../../../middleware/authorization.middleware')


router.post('/', authorization.Authorization, controller.postComment)
router.put('/', authorization.Authorization, controller.editComment)
router.delete('/:id', authorization.Authorization, controller.deleteComment)



module.exports = router;