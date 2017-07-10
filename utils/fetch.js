const Encrypt = require('./crypto.js')
const http = require('http')
const config = require('../config')
function fetch(path, method, data = {}, isEasy = false) {
  let _req = ''
  const _data = data
  return new Promise((resolve, reject) => {
    const http_client = http.request({
      hostname: config.host,
      method: method,
      path: path,
      headers: {
        'X-Real-IP': '211.161.244.70',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://music.163.com',
        'Host': 'music.163.com',
        'Cookie': 'appver=2.0.2',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36',

      },
    }, function (res) {
      res.on('error', function (err) {
        reject(err)
      })
      res.setEncoding('utf8')
      if (res.statusCode != 200) {
        fetch(path, method, _data)
        return
      } else {
        res.on('data', function (chunk) {
          _req += chunk
        })
        res.on('end', function () {
          if (_req == '') {
            fetch(path, method, _data)
            return
          }
          resolve(_req)
        })
      }
    })
    if (isEasy) {
      http_client.write(_data)
    } else {
      const cryptoreq = Encrypt(_data)
      http_client.write('params=' + cryptoreq.params + '&encSecKey=' + cryptoreq.encSecKey)
    }
    http_client.end()
  })
}
module.exports = fetch