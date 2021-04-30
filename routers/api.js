var express = require("express");
var router = express.Router();
const { Ok, Err } = require("./apiResponse");
const {
  handleSearchIllust,
  handleSearchUser,
  handleUserIllust,
} = require("../src/handleillust");
const { saveUrl } = require("../src/saveimg");
let pixiv;

const setPixiv = (p) => {
  pixiv = p;
};
router.get("/", (req, res) => {
  console.log(req.query);
  let url = req.query.url;
  if (!url) {
    res.json(Err("Don't HAVE A URL"));
    return;
  }
  saveUrl(url).then((finalUrl) => {
    res.json({ url: finalUrl });
    return;
  });
});
router.get("/test", (req, res) => {
  let type = req.query.type;
  let option;
  if (pixiv[type]) {
    let ans = pixiv[type]();
    res.json(Ok(auth));
    return;
  }
  res.json(Err("NOT TYPE"));
  return;
});
router.get("/searchUser", async (req, res) => {
  let word = req.query.word;
  if (word) {
    let users = await pixiv.searchUser(word);

    users = handleSearchUser(users, 10);
    res.json({
      code: 0,
      p: 0,
      number: users.length,
      users,
    });
    return;
  } else {
    res.json(Err("NO WORD"));
    return;
  }
});
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
router.get("/userIllust", async (req, res) => {
  let id = req.query.id;
  if (id) {
    let illusts = (await pixiv.userIllusts(id)).illusts;
    let UserIllusts = await handleUserIllust(illusts, 4, 1);
    if (!UserIllusts.id) {
      res.json(Err("Don't find user!"));
      return;
    } else {
      res.json(Ok(UserIllusts));
    }
  } else {
    res.json(Err("Don't find user!"));
    return;
  }
});
router.get("/random", async (req, res) => {
  let keyword = req.query.keyword;
  let r18 = req.query.r18;

  if (!r18) r18 = 0;
  // console.log(typeof r18);

  let t;
  try {
    if (keyword) {
      t = pixiv.searchIllust(keyword, {
        search_target: "title_and_caption",
      });
    } else {
      t = pixiv.illustRecommended();
    }
  } catch (error) {
    console.log(error);
  }
  t.then(async (data) => {
    if (data.illusts.length === 0) {
      res.json({ code: 404, error: "没有符合条件的色图（。）" });
      return;
    } else {
      let ans = await handleSearchIllust(data.illusts, 1, r18);
      if (!ans) {
        res.json({ code: 404, msg: "NOT FOUND" });
        return;
      }
      res.json({
        code: 0,
        p: 0,
        url: `https://www.pixiv.net/artworks/${ans[0].id}`,
        file: ans[0].urls,
      });
      return;
    }
  }).catch((r) => console.log(r));
});

router.get("/searchIllust", async (req, res) => {
  let keyword = req.query.keyword;
  if (!keyword) {
    res.json(Err("keyword IS　REQUIRED"));
    return;
  }

  let data = await pixiv.searchIllustPopularPreview(keyword, {
    search_target: "exact_match_for_tags",
  });

  if (!data.illusts.length) {
    res.json(Err("NOT FOUND"));
    return;
  } else {
    let ans = await handleSearchIllust(data.illusts, 10);
    res.json(Ok({ ans, length: ans.length }));
    return;
  }
});

module.exports = {
  setPixiv,
  router,
};
