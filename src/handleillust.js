const { Illust } = require("./apimodel");
const handleSearchIllust = (illusts, number) => {
  let ans = [];
  let ill = illusts;
  ill = ill.sort((a, b) => {
    return a.total_bookmarks < b.total_bookmarks;
  });

  ill = ill.slice(0, number);
  ill.map((r) => {
    let nowill = new Illust();
    nowill.id = r.id;
    nowill.title = r.title;
    nowill.total_bookmarks = r.total_bookmarks;
    nowill.userid = r.user.id;
    if (r.meta_single_page.original_image_url)
      nowill.urls.push(r.meta_single_page.original_image_url);
    r.meta_pages.map((rx) => {
      if (rx.image_urls) nowill.urls.push(rx.image_urls.original);
    });
    ans.push(nowill);
  });
  return ans;
};

module.exports = {
  handleSearchIllust,
};
