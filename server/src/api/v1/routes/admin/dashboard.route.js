const express = require("express");
const routes = express.Router();
const controller = require("../../../v1/controllers/admin/stats.controller");
const authorization = require("../../../../middleware/authorization.middleware");
routes.get("/stats/users", authorization.AuthorizationAdmin, controller.getUserStats);

routes.get("/stats/new-users", authorization.AuthorizationAdmin, controller.getNewUsersInLastMonth);

routes.get("/stats/quiz", authorization.AuthorizationAdmin, controller.getQuizStats);

routes.get("/stats/new-quiz", authorization.AuthorizationAdmin, controller.getNewQuizzes);

routes.get("/stats/blogs", authorization.AuthorizationAdmin, controller.getBlogsStats);

routes.get("/stats/top-quiz", authorization.AuthorizationAdmin, controller.getTopQuizCreator);

module.exports = routes;

