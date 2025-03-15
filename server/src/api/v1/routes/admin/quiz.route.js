const express = require("express");
const routes = express.Router();
const controller = require("../../controllers/admin/quiz.controller");
const authorization = require("../../../../middleware/authorization.middleware");

routes.get("/allQuiz", authorization.Authorization, controller.allQuiz);
routes.delete(
  "/removeQuiz/:id",
  authorization.Authorization,
  controller.removeQuiz
);
routes.put(
  "/toggleStatusQuiz/:id",
  authorization.Authorization,
  controller.toggleStatusQuiz
);

module.exports = routes;
