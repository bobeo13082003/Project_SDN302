const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/auth.controller')
const validate = require('../../../../validate/client/authUser.validate')
const authorization = require('../../../../middleware/authorization.middleware')

routes.post('/register', validate.registerValidate, controller.register)
routes.post('/login', validate.loginValidate, controller.login)
routes.post('/forgot-password', controller.forgot)
routes.post('/otp', controller.otp)
routes.post('/reset-password', validate.resetPasswordValidate, controller.reset)
routes.get('/user-profile', authorization.Authorization, controller.profile)
routes.patch('/edit-profile', authorization.Authorization, controller.editProfile)


module.exports = routes;