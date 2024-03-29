const express = require('express');
const axios = require('axios');
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/xvs', async (req, res) => {
    const user = req.query.user;
    if (!user) return res.json({ status: false, creator: 'sezraah', message: '[!] masukan parameter user' });
    
        return new Promise((resolve, reject) => {
    const baseurl = "https://www.xnxx.com";
    fetch(`${baseurl}/search/${user}/${Math.floor(Math.random() * 3) + 1}`, {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => {
        let $ = cheerio.load(res, {
          xmlMode: false,
        });
        let title = [];
        let url = [];
        let desc = [];
        let results = [];

        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb")
            .each(function (c, d) {
              url.push(
                baseurl + $(d).find("a").attr("href").replace("/THUMBNUM/", "/")
              );
            });
        });
        $("div.mozaique").each(function (a, b) {
          $(b)
            .find("div.thumb-under")
            .each(function (c, d) {
              desc.push($(d).find("p.metadata").text());
              $(d)
                .find("a")
                .each(function (e, f) {
                  title.push($(f).attr("title"));
                });
            });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({
            title: title[i],
            info: desc[i],
            link: url[i],
          });
        }
        resolve({
          creator: "baadan",
          code: 200,
          status: true,
          result: results,
        });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
