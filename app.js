// 应用程序的启动入口文件
// 加载express模块
var express = require("express");
// 加载模板处理模块
// var swig = require("swig");

const Fse = require("fs-extra");
const Path = require("path");
const pixivApi = require("./src/pixiv-api-client-mod");
const { applyProxyConfig } = require("./src/proxy");
const { setPixiv } = require("./routers/api");
var bodyParser = require("body-parser");
//加载cookies模块
var Cookies = require("cookies");

const CONFIG_FILE_PATH = "config.json";
// 加载数据库模块

Init().then((port) => {
  // 创建app应用 => NodeJs
  var app = express().listen()._events.request;

  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  // 设置静态文件托管
  // 当用户访问的URL以/public开始，那么直接返回对应__dirname + '/public'下的文件
  // 创建应用模板
  // 第一个参数：模板引擎的名称，同事也是模板文件的后缀，第二个参数表示用于u解析处理模板内容的方法
  // 设置模板文件存放的目录，第一个必须是views，第二个参数是目录
  // 注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称一致
  // 在开发过程中，需要取消模板缓存
  // swig.setDefaults({ cache: false });
  app.use(bodyParser.json());
  //  bodyparse设置
  app.use(bodyParser.urlencoded({ extended: true }));

  // Cookies设置
  // app.use(function(req, res, next) {
  //   // 创建一个cookies对象
  //   req.cookies = new Cookies(req, res);

  //   // 解析登录用户的cookies信息
  //   if (req.cookies.get("userInfo")) {
  //     try {
  //       req.userInfo = JSON.parse(req.cookies.get("userInfo"));
  //     } catch (e) {
  //       next();
  //     }
  //   }
  //   next();
  // });

  // 根据不同功能划分模块
  // app.use("/admin", require("./routers/admin"));
  app.use("/api", require("./routers/api").router);
  // app.use("/", require("./routers/main"));

  // 第一个参数 连接的协议和地址

  //监听http请求
  app.listen(port || 8765, () => {
    console.log("监听" + port || 8765 + "端口");
  });
});
async function Init() {
  let config = Fse.readJsonSync(CONFIG_FILE_PATH);
  console.log(config);
  if (config.proxy) {
    applyProxyConfig(config.proxy);
  }
  if (config.refresh_token) {
    await relogin(config.refresh_token);
  }
  return config.port;
}

let reloginInterval;
async function relogin(refresh_token) {
  if (!refresh_token) return false;
  let pixiv = new pixivApi();
  let t = await pixiv.refreshAccessToken(refresh_token);
  console.log(t);
  setPixiv(pixiv);
  await saveRefreshToken(t.refresh_token);
  reloginInterval = setInterval(async () => {
    let config = Fse.readJsonSync(CONFIG_FILE_PATH);
    let t = await pixiv.refreshAccessToken(config.refresh_token);
    await saveRefreshToken(t.refresh_token);
    console.log("access_token:", t.access_token);
    console.log("refresh_token:", t.refresh_token);
  }, 30 * 60 * 1000);
}

async function saveRefreshToken(refresh_token) {
  let config = await Fse.readJsonSync(CONFIG_FILE_PATH);
  config.refresh_token = refresh_token;
  try {
    Fse.writeJsonSync(CONFIG_FILE_PATH, config);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}
