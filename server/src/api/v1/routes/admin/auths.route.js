const express = require('express')
const routes = express.Router();
const controller = require('../../controllers/admin/auth.controller');
routes.post('/admin', controller.register);
routes.post('/admin/login', controller.login);

module.exports = routes;
