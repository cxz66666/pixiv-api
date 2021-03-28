const Config = require("./config");
const Http = require("http");

module.exports = () => {
  return new Promise((resolve) => {
    const server = Http.createServer((req, res) => {
      res.writeHead(200, { Connection: "close" });
      res.end();
      // console.log(req);
      const url = new URL(`http://host${req.url}`);
      const code = url.searchParams.get("code");
      // console.log(code);
      if (!code) return;
      resolve(code);
      server.close(() => {
        Config.modify({ port: 0 });
      });
    }).listen(0, "127.0.0.1", () => {
      Config.modify({ port: server.address().port });
    });
  });
};
