const authsRoute = require('./auths.route');
const blogRoute = require('./blog.route');
const generalSettingRoute = require('./generalSetting.route');
const dashboardRoute = require('./dashboard.route');
const quizzesRoute = require('./quiz.route')
const adsRoutes = require("./ads.route");
const commentRoute = require('./comment.route')


module.exports = (app) => {
    const api = '/api/v1'
    app.use(api + '/auth', authsRoute);
    app.use(api + '/blog', blogRoute);
    app.use(api + '/general-setting', generalSettingRoute)
    app.use(api + '/dashboard', dashboardRoute)
    app.use(api + '/manage-quizzes', quizzesRoute)
    app.use(api + "/ads", adsRoutes);
    app.use(api + '/comment', commentRoute)

}