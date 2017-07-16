const path = require('path')
const Koa = require('koa2')
const static = require('koa-static')
const restc = require('restc')
const bodyparser = require('koa-bodyparser')
const cors = require('koa-cors')
const app = new Koa()
const router = require('./router')

app.use(static(path.join(__dirname, './static')))

app.use(restc.koa2())
app.use(cors())
app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server running @${port}`)
})

module.exports = app
