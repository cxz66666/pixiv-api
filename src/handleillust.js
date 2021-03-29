const { Illust, User, UserIllusts } = require("./apimodel");
const { saveUrl } = require("./saveimg");
const handleSearchIllust = async (illusts, number, r18 = 0) => {
  let ans = [];
  let ill = illusts;

  ill = ill.sort((a, b) => {
    return a.total_bookmarks < b.total_bookmarks;
  });

  ill = ill.slice(0, number);
  for (let r of ill) {
    let nowill = new Illust();
    nowill.id = r.id;
    nowill.title = r.title;
    nowill.total_bookmarks = r.total_bookmarks;
    nowill.userid = r.user.id;
    preurl = [];
    if (r.meta_single_page.original_image_url) {
      preurl.push(saveUrl(r.meta_single_page.original_image_url));
    }

    r.meta_pages.map((rx) => {
      if (rx.image_urls) {
        preurl.push(saveUrl(rx.image_urls.original));
      }
    });

    preurl = await Promise.all(preurl);
    console.log(preurl);
    nowill.urls = preurl;
    ans.push(nowill);
  }

  return ans;
};
const handleUserIllust = async (illusts, number, r18 = 0) => {
  let ans = new UserIllusts();
  let ill = illusts;
  ill = ill.filter((r) => {
    return r18 ? r.sanity_level > 4 : r.sanity_level <= 4;
  });
  ill = ill.sort((a, b) => {
    return a.total_bookmarks < b.total_bookmarks;
  });
  ill = ill.slice(0, number);

  for (let r of ill) {
    ans.id = r.user.id;
    ans.name = r.user.name;
    nowill = new Illust();
    nowill.id = r.id;
    nowill.title = r.title;
    nowill.total_bookmarks = r.total_bookmarks;
    nowill.userid = r.user.id;
    preurl = [];
    if (r.meta_single_page.original_image_url) {
      preurl.push(saveUrl(r.meta_single_page.original_image_url));
    }

    r.meta_pages.map((rx) => {
      if (rx.image_urls) {
        preurl.push(saveUrl(rx.image_urls.original));
      }
    });

    nowill.urls = await Promise.all(preurl);
    ans.illusts.push(nowill);
  }

  ans.count = ans.illusts.length;
  return ans;
};
const handleSearchUser = (users, number) => {
  users = users.slice(0, number);
  let ans = [];
  users.user_previews.map((r) => {
    let nowuser = new User();
    nowuser.id = r.user.id;
    nowuser.name = r.user.name;
    nowuser.count = r.illusts.length;
    ans.push(nowuser);
  });
  return ans;
};
module.exports = {
  handleSearchIllust,
  handleSearchUser,
  handleUserIllust,
};
