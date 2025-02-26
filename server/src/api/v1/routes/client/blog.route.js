const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/blog.controller');
const authorization = require('../../../../middleware/authorization.middleware')

router.get('/getBlog', controller.allBlogs)
router.get('/detailBlog', authorization.Authorization, controller.detailBlog)
router.post('/like', controller.likeBlog)
router.get(
  "/liked-blogs/count",
  authorization.Authorization,
  controller.getLikedBlogsCount
);


module.exports = router;