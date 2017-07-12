const readFile = require('./readFile')
async function test() {
  let _begin = Date.now()
  let a1 = await readFile('./text/a1.txt')
  let a2 = await readFile(`./text/${a1}.txt`)
  console.log(a2)
  console.log('%s:%s', '耗时', Date.now() - _begin)
}
test()