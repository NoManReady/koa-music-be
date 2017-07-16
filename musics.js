const { fetch } = require('./utils/fetch')
let fs = require('fs')
let path = require('path')
// 深度删除文件
function deleteall(path) {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      var curPath = path + "/" + file
      if (fs.statSync(curPath).isDirectory()) { // recurse  
        deleteall(curPath)
      } else { // delete file  
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
// 歌曲目录
let _path_music = path.join(__dirname, './music')

//歌词目录 
let _path = path.join(__dirname, './lyric')

// let readDataString = fs.readFileSync(path.join(__dirname, './music.json'), { encoding: 'utf-8' })
const lyric = async (id, name) => {
  let _lyric = await fetch(`/api/song/lyric?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`, 'GET', null)
  fs.writeFile(path.join(__dirname, `./lyric/${id}.json`), _lyric, { encoding: 'utf-8' }, err => {
    if (err) {
      console.log(err)
    }
  })
}
// JSON.parse(readDataString).forEach(m => {
//   lyric(m.id, m.name)
// })

const request = require('request')
const music = async (id, name) => {
  request(`http://hzzly.net:3000/music/url?id=${id}`, (err, res, body) => {
    fs.writeFile(path.join(__dirname, `./music/${id}.json`), body, { encoding: 'utf-8' }, err => {
      if (err) {
        console.log(err)
      }
    })
  })
}
// JSON.parse(readDataString).forEach(m => {
//   music(m.id, m.name)
// })
module.exports = (musics) => {
  musics.result.tracks.forEach(m => {
    let isExist_music = fs.existsSync(_path_music)
    let isExist = fs.existsSync(_path)
    console.log(m.name)
    if (!isExist_music) {
      fs.mkdirSync(_path_music)
    }
    if (!isExist) {
      fs.mkdirSync(_path)
    }
    // if (fs.existsSync(path.join(_path, `${m.id}.json`))) {
    //   return
    // }
    music(m.id, m.name)
    lyric(m.id, m.name)
  })
}