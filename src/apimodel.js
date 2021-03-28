class Illust {
  constructor() {
    this.id = 0;
    this.title = null;
    this.userid = 0;
    this.urls = [];
    this.total_bookmarks = 0;
  }
}
class User {
  constructor() {
    this.id = 0;
    this.name = "";
    this.count = 0;
  }
}
class UserIllusts extends User {
  constructor() {
    super();
    this.illusts = [];
  }
}
module.exports = {
  Illust,
  User,
  UserIllusts,
};
