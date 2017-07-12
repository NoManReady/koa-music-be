const readFile = require('./readFile')
function run(fn) {
  var g = fn()
  function next(data) {
    var result = g.next(data)
    if (result.done) return result.value
    result.value.then(function (data) {
      next(data)
    })
  }
  next()
}
const test = function* () {
  let _begin = Date.now()
  let a1 = yield readFile('./text/a1.txt')
  let a2 = yield readFile(`./text/${a1}.txt`)
  console.log(a2)
  console.log('%s:%s', '耗时', Date.now() - _begin)
}

run(test)