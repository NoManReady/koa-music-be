const Router = require('koa-router')
const router = new Router()

const api = require('./api')
const view = require('./view')
async function getUrl(ctx, next) {
  let _host = ctx.get('host')
  // if (!_host.includes('localhost')) {
  //   ctx.body = '401'
  //   ctx.status = 401
  // } else {
  //   await next()
  // }
  await next()
}
async function logTime(ctx, next) {
  let _begin = Date.now()
  await next()
  let _range = Date.now() - _begin
  ctx.set('X-Response-Time', _range)
  ctx.set('X-Power-By', 'NoManReady')
  console.log('%s-%s:%s', ctx.url, '耗时', _range)
}
router.use('/api', getUrl, logTime, api.routes(), api.allowedMethods())
router.use('/view', view.routes(), view.allowedMethods())
module.exports = router