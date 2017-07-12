function run(fn, initial) {
  let gen = fn(initial);
  function next(err, data) {
    let result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}
function a1Fn(d) {
  return function (next) {
    setTimeout(() => {
      next(null, 'a1' + d)
    }, 1000)
  }
}
function a2Fn(d) {
  return function (next) {
    setTimeout(() => {
      next(null, 'a2' + d)
    }, 1000)
  }
}
function a3Fn(d) {
  return function (next) {
    setTimeout(() => {
      next(null, 'a3' + d)
    }, 2000)
  }
}
function* test(init = 1) {
  let _begin = Date.now()
  let a1 = yield a1Fn(init)
  let a2 = yield a2Fn(a1)
  let a3 = yield a3Fn(a2)
  console.log(a3)
  console.log('%s:%s', '耗时', Date.now() - _begin)
}
run(test, 'init')