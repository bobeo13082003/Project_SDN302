const express = require('express')
const routes = express.Router();
const controller = require('../../controllers/admin/blog.controller');
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadCloud = require('../../../../middleware/uploadCloud');
const authorization = require("../../../../middleware/authorization.middleware");

routes.get('/allBlog', authorization.Authorization, controller.getAllBlogs);
routes.post('/addBlog',
    authorization.Authorization,
    upload.single('image'),
    uploadCloud.uploadCloud,
    controller.addBlog);
routes.delete('/deleteBlog', authorization.Authorization, controller.deleteBlog)
routes.patch('/editBlog',
    authorization.Authorization,
    upload.single('image'),
    uploadCloud.uploadCloud,
    controller.updateBlog);
module.exports = routes;