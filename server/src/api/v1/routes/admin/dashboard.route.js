const express = require("express");
const routes = express.Router();
const controller = require("../../../v1/controllers/admin/stats.controller");

routes.get("/stats/users",controller.getUserStats);

routes.get("/stats/new-users",controller.getNewUsersInLastMonth);

routes.get("/stats/quiz",controller.getQuizStats);

routes.get("/stats/new-quiz",controller.getNewQuizzes);

routes.get("/stats/blogs",controller.getBlogsStats);

routes.get("/stats/top-quiz", controller.getTopQuizCreator);

module.exports = routes;

