var request = require("request")
var cheerio = require("cheerio")
var express = require("express")
var cors = require("cors")
var app = express()
var data = []

var options = {
  method: "GET",
  url: "https://www.ptt.cc/bbs/NBA/index.html",
}
app.use(cors())
app
  .get("/", function (req, res) {
    ;(async function () {
      var post = await getpost()
      res.json(post)
    })()
  })
  .listen(3000)

async function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      const $ = cheerio.load(res.body)
      var list = $(".r-ent")
      let data = []
      for (let i = 0; i < list.length; i++) {
        const title = list.eq(i).find(".title a").text()
        const author = list.eq(i).find(".meta .author").text()
        const date = list.eq(i).find(".meta .date").text()
        const link = list.eq(i).find(".title a").attr("href")
        data.push({ title, author, date, link })
      }
      if (!error && res.statusCode == 200) {
        resolve(data)
      } else {
        reject(error)
      }
      // console.log(data)
      // data.splice(0,data.length);
    })
  })
}

async function getPageIndex(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      const $ = cheerio.load(res.body) // 載入 body
      let prev = $(".btn-group-paging a").eq(1).attr("href").match(/\d+/)[0]
      if (!error && res.statusCode == 200) {
        resolve(prev)
      } else {
        reject(error)
      }
      // console.log(data)
      // data.splice(0,data.length);
    })
  })
}

// Usage:

// async function main() {
//   let res = await doRequest("https://www.ptt.cc/bbs/NBA/index" + "6507" + ".html")
//   console.log(res)
// }

async function getpost() {
  return new Promise(async (resolve, reject) => {
    let prev = await getPageIndex(options)
    console.log(prev)
    data = []
    for (var i = parseInt(prev) - 1; i <= parseInt(prev) + 1; i++) {
      const res = await doRequest("https://www.ptt.cc/bbs/NBA/index" + i + ".html")
      data.push(res)
    }
    console.log(data[0].length + data[1].length + data[2].length)
    resolve(data)
  })
}