var express = require("express");
var router = express.Router();
const { Ok, Err } = require("./apiResponse");
const { handleSearchIllust } = require("../src/handleillust");
let pixiv;

const setPixiv = (p) => {
  pixiv = p;
};

router.get("/authinfo", (req, res) => {
  let token = req.query.token;
  //   console.log(req.query);
  //   console.log(req.params);
  if (token === pixiv.authInfo().refresh_token) {
    let auth = pixiv.authInfo();
    res.json(Ok(auth));
    return;
  }
  res.json(Err("NOT AUTH"));
  return;
});
router.get("/random", (req, res) => {
  let keyword = req.query.keyword;
  let r18 = req.query.r18;

  if (!r18) r18 = 0;
  // console.log(typeof r18);

  let t;
  if (keyword) t = pixiv.searchIllustPopularPreview(keyword);
  else
    t = pixiv.illustRanking({
      mode: r18 ? "day_female_r18" : "day_female",
    });

  t.then((data) => {
    if (data.illusts.length === 0) {
      res.json({ code: 404, error: "没有符合条件的色图（。）" });
      return;
    } else {
      let ans = handleSearchIllust(data.illusts, 10, r18);
      console.log(ans);
      let Random = ans[Math.floor(Math.random() * ans.length)];
      if (!Random) {
        res.json({ code: 404, msg: "NOT FOUND" });
        return;
      }
      res.json({
        code: 0,
        p: 0,
        url: `https://www.pixiv.net/artworks/${Random.id}`,
        file: Random.urls[0],
      });
      return;
    }
  });
});
router.get("/searchIllust", (req, res) => {
  let keykeyword = req.query.keykeyword;
  if (!keyword) {
    res.json(Err("keyword IS　REQUIRED"));
    return;
  }

  let t = pixiv.searchIllustPopularPreview(keyword);
  t.then((data) => {
    if (!data.illusts.length) {
      res.json(Err("NOT FOUND"));
      return;
    } else {
      let ans = handleSearchIllust(data.illusts, 10);
      res.json(Ok({ ans, length: ans.length }));
      return;
    }
  });
});

router.get("/userIllust", (req, res) => {
  let uid = req.query.uid;
  if (!uid) {
    res.json(Err("UID IS　REQUIRED"));
    return;
  }
  let number = req.query.number ? req.query.number : 3;
  let t = pixiv.userIllusts(uid);
  t.then((data) => {
    if (!data.illusts.length) {
      res.json(Err("DON'T FOUND ILLUSTS"));
      return;
    } else {
      let ans = handleSearchIllust(data.illusts, number);
      res.json(Ok({ ans, length: ans.length }));
      return;
    }
  });
});
module.exports = {
  setPixiv,
  router,
};
