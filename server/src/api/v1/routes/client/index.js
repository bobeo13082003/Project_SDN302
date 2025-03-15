const authsRoute = require('./auths.route')
const quizzesRoute = require('./quiz.route')
const blogRoute = require('./blog.route')
const labraryRoute = require('./labrary.route')
const notificationRoute = require('./notification.route')
const adminRoutes = require('../admin/admin.route')
const adsRoutes = require("./ads.routes")
const commentRoute = require('./comment.route')

module.exports = (app) => {
    const api = '/api/v1'
    app.use(api + '/auth', authsRoute)
    app.use(api + '/quiz', quizzesRoute)
    app.use(api + '/blog', blogRoute)
    app.use(api + '/admin', adminRoutes);
    app.use(api + '/labrary', labraryRoute);
    app.use(api + '/notification', notificationRoute);
    app.use(api + "/ads", adsRoutes);
    app.use(api + '/comment', commentRoute);


}