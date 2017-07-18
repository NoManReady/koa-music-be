const Router = require('koa-router')
const { fetch, easyRequest, } = require('../../utils/fetch')
const result = require('../../utils/result')
const router = new Router()
let fs = require('fs')
let path = require('path')
let http = require('http')
let fnv = require('fnv-plus')
let setStorage = require('../../musics')
const read = (p) => {
  let _data = fs.readFileSync(path.join(__dirname, p), { encoding: 'utf-8' })
  return _data
}
// 获取歌单列表（popular:3778678,classical:71384707,light:26467411,radio:897089）
router.get("/banner", async (ctx) => {
  let _list = await fetch(`/api/v2/banner/get`, 'GET', null)
  ctx.body = JSON.parse(_list)
})

// 获取歌单列表（popular:3778678,classical:71384707,light:26467411,radio:897089）
router.get("/playlist", async (ctx) => {
  let _id = ctx.query.id
  let _list = await fetch(`/api/playlist/detail?id=${_id}`, 'GET', null)
  // let _list = read('../../music.json')
  let _result = JSON.parse(_list)
  setStorage(_result)
  ctx.body = _result
})

// 获取歌词
router.get("/lyric", async (ctx) => {
  let _id = ctx.query.id
  // let _lyric = await fetch(`/api/song/lyric?os=osx&id=${_id}&lv=-1&kv=-1&tv=-1`, 'GET', null)
  let _lyric = read(`../../lyric/${_id}.json`)
  ctx.body = JSON.parse(_lyric)
})

// 获取音乐
router.get("/music", async (ctx) => {
  let _id = ctx.query.id
  // let _br = 999000
  // let _data = {
  //   'ids': [_id],
  //   'br': _br,
  //   'csrf_token': ''
  // }
  // // let _music = await fetch(`/weapi/song/enhance/player/url`, 'POST', _data, null)
  // let _music = JSON.stringify({ "data": [{ "id": 28285910, "url": "http://m10.music.126.net/20170713145025/512aa61a4d065d340005026a07105a8e/ymusic/10ad/ecdc/b6e0/1db87400ccb4d86ece611f5a17d72948.mp3", "br": 192000, "size": 3890826, "md5": "1db87400ccb4d86ece611f5a17d72948", "code": 200, "expi": 1200, "type": "mp3", "gain": 0.0363, "fee": 0, "uf": null, "payed": 0, "flag": 2, "canExtend": false }], "code": 200 })
  let _music = read(`../../music/${_id}.json`)
  ctx.body = JSON.parse(_music)
})

function originFile(url) {
  return new Promise(r => {
    http.get(url, (response) => {
      response.setEncoding('binary')
      var type = response.headers["content-type"]
      var buffer = ''
      response.on('data', function (data) {
        buffer += data
      }).on('end', function () {
        r([buffer, type])
      })
    })
  })
}

// router.get('/buffer', async ctx => {
//   let _url = ctx.query.url
//   let _result = fs.readFileSync(path.join(__dirname, '../../mp3/test.mp3'), { encoding: 'binary' })
//   // ctx.set('Content-Type', _result[1])
//   ctx.type = 'binary'
//   ctx.body = _result
// })


// 搜索歌曲
router.get("/search", async (ctx) => {
  let _keywords = ctx.query.keywords
  let _type = ctx.query.type || 1
  let _limit = ctx.query.limit || 30
  let _offset = ctx.query.offset || 0
  // 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002) *(type)*
  let _data = 's=' + _keywords + '&limit=' + _limit + '&type=' + _type + '&offset=' + _offset
  let _music = await fetch(`/api/search/pc`, 'POST', _data, true)
  ctx.body = JSON.parse(_music)
})
const top_list_all = {
  "0": ['云音乐新歌榜', '/api/playlist/detail?id=3779629'],
  "1": ['云音乐热歌榜', '/api/playlist/detail?id=3778678'],
  "2": ['网易原创歌曲榜', '/api/playlist/detail?id=2884035'],
  "3": ['云音乐飙升榜', '/api/playlist/detail?id=19723756'],
  "4": ['云音乐电音榜', '/api/playlist/detail?id=10520166'],
  "5": ['UK排行榜周榜', '/api/playlist/detail?id=180106'],
  "6": ['美国Billboard周榜', '/api/playlist/detail?id=60198'],
  "7": ['KTV嗨榜', '/api/playlist/detail?id=21845217'],
  "8": ['iTunes榜', '/api/playlist/detail?id=11641012'],
  "9": ['Hit FM Top榜', '/api/playlist/detail?id=120001'],
  "10": ['日本Oricon周榜', '/api/playlist/detail?id=60131'],
  "11": ['韩国Melon排行榜周榜', '/api/playlist/detail?id=3733003'],
  "12": ['韩国Mnet排行榜周榜', '/api/playlist/detail?id=60255'],
  "13": ['韩国Melon原声周榜', '/api/playlist/detail?id=46772709'],
  "14": ['中国TOP排行榜(港台榜)', '/api/playlist/detail?id=112504'],
  "15": ['中国TOP排行榜(内地榜)', '/api/playlist/detail?id=64016'],
  "16": ['香港电台中文歌曲龙虎榜', '/api/playlist/detail?id=10169002'],
  "17": ['华语金曲榜', '/api/playlist/detail?id=4395559'],
  "18": ['中国嘻哈榜', '/api/playlist/detail?id=1899724'],
  "19": ['法国 NRJ EuroHot 30周榜', '/api/playlist/detail?id=27135204'],
  "20": ['台湾Hito排行榜', '/api/playlist/detail?id=112463'],
  "21": ['Beatport全球电子舞曲榜', '/api/playlist/detail?id=3812895']
}
// 获取排行版
router.get("/rank", async (ctx) => {
  let _type = ctx.query.type || 17
  let _lyric = await fetch(`${top_list_all[_type][1]}`, 'GET', null)
  ctx.body = JSON.parse(_lyric)
})


router.get('/canvasList', async ctx => {
  let _files = fs.readdirSync(path.join(__dirname, '../../static'))
  _files = _files.filter(f => {
    return f.indexOf('.') === -1 || f.indexOf('.') > 0
  })
  ctx.body = {
    list: _files.map(f => {
      let b = new Buffer(f)
      return { name: f, id: b.toString('hex') }
    })
  }
})
router.get('/canvas/:id', async ctx => {
  let _id = ctx.params.id
  let _name = new Buffer(_id, 'hex')
  ctx.body = fs.readFileSync(path.join(__dirname, `../../static/${_name.toString('utf8')}`))
})


module.exports = router