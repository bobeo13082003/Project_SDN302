const express = require('express')
const routes = express.Router();
const controller = require('../../controllers/client/quiz.controller')
const authorization = require('../../../../middleware/authorization.middleware')
const lastestQuiz = require('../../controllers/client/latestQuiz.controller')

routes.get('/allQuiz', controller.allQuiz);
routes.post('/addQuiz', authorization.Authorization, controller.addQuiz);
routes.get('/questionByQuizID/:quizId', controller.questionByQuizID);
routes.put('/updateQuiz/:id', authorization.Authorization, controller.updateQuiz);
routes.delete('/removeQuiz/:id', authorization.Authorization, controller.removeQuiz);
routes.delete('/deleteQuiz/:id', controller.deleteQuiz);
routes.get('/getQuiz', controller.getQuiz);
routes.put('/countTraffic/:id', authorization.Authorization, controller.countTraffic);
routes.get('/countQuiz', controller.countQuiz);
routes.get('/mostRecentQuiz', controller.selectQuizMostTraffic);
routes.get('/getXmlQuiz/:id', controller.exportQuestionsToXML);
routes.post('/addXmlQuiz', authorization.Authorization,controller.importQuestionsFromXML);

routes.post('/lastesQuiz', authorization.Authorization, lastestQuiz.lastestQuiz)
routes.get('/mostLatesQuiz', authorization.Authorization, lastestQuiz.listLastQuiz)

routes.post('/addQuizFromExcel', authorization.Authorization, controller.addQuizFromExcel);
routes.get('/search', controller.searchQuiz);
routes.get('/myQuiz', authorization.Authorization, controller.getUserQuiz);

routes.get('/exportQuizToExcel/:id', controller.exportQuestionsToExcel);



module.exports = routes;
