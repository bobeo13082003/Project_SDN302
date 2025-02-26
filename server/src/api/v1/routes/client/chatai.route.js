const express = require('express');
const routes = express.Router();
const chataiController = require('../../controllers/client/chatai.controller');

// Định nghĩa route
routes.get('/AllChatAI', chataiController.allChatais);

module.exports = routes;
