const Router = require('koa-router')
const fetch = require('../../utils/fetch')
const result = require('../../utils/result')
const router = new Router()
// 获取歌单列表（popular:3778678,classical:71384707,light:26467411,radio:897089）
router.get("/banner", async (ctx) => {
  let _list = await fetch(`/api/v2/banner/get`, 'GET', null)
  ctx.body = JSON.parse(_list)
})

// 获取歌单列表（popular:3778678,classical:71384707,light:26467411,radio:897089）
router.get("/playlist", async (ctx) => {
  let _id = ctx.query.id || 3778678
  let _list = await fetch(`/api/playlist/detail?id=${_id}`, 'GET', null)
  ctx.body = JSON.parse(_list)
})

// 获取歌词
router.get("/lyric", async (ctx) => {
  let _id = ctx.query.id || 439915614
  let _lyric = await fetch(`/api/song/lyric?os=osx&id=${_id}&lv=-1&kv=-1&tv=-1`, 'GET', null)
  ctx.body = JSON.parse(_lyric)
})

// 获取音乐
router.get("/music", async (ctx) => {
  let _id = ctx.query.id || 484730895
  let _br = ctx.query.br || 999000
  let _data = {
    'ids': [_id],
    'br': _br,
    'csrf_token': ''
  }
  let _music = await fetch(`/weapi/song/enhance/player/url`, 'POST', _data)
  ctx.body = JSON.parse(_music)
})

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


module.exports = router