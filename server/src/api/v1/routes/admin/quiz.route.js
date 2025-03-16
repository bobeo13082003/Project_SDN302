const express = require("express");
const routes = express.Router();
const controller = require("../../controllers/admin/quiz.controller");
const authorization = require("../../../../middleware/authorization.middleware");

routes.get("/allQuiz", authorization.AuthorizationAdmin, controller.allQuiz);
routes.delete(
  "/removeQuiz/:id",
  authorization.AuthorizationAdmin,
  controller.removeQuiz
);
routes.put(
  "/toggleStatusQuiz/:id",
  authorization.AuthorizationAdmin,
  controller.toggleStatusQuiz
);

module.exports = routes;
