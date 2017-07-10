const Router = require('koa-router')
const router = new Router()

const api = require('./api')
const view = require('./view')
router.use('/api', api.routes(), api.allowedMethods())
router.use('/view', view.routes(), view.allowedMethods())
module.exports = router