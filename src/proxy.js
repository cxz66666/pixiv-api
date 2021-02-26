const flatMap = require("lodash.flatmap");

const SocksProxyAgent = require("socks-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");
const PixivApi = require("./pixiv-api-client-mod");

const envNames = flatMap(["all_proxy", "https_proxy", "http_proxy"], (name) => [
  name,
  name.toUpperCase(),
]);
const getProxyAgent = (str) => {
  if (str.startsWith("http://") || str.startsWith("https://"))
    return new HttpsProxyAgent(str);
  if (str.startsWith("socks://")) return new SocksProxyAgent(str, true);
  return null;
};

const getSysProxy = () => {
  const proxyEnv = envNames.find((name) => process.env[name]);
  return proxyEnv ? proxyEnv.trim() : null;
};

const delSysProxy = () => {
  envNames.forEach((name) => delete process.env[name]);
};

const applyProxyConfig = (proxy) => {
  const sysProxy = getSysProxy();
  const agent = getProxyAgent(proxy) || getProxyAgent(sysProxy);
  if (sysProxy) delSysProxy();
  if (agent) {
    PixivApi.setAgent(agent);
    global.proxyAgent = agent;
  }
};

module.exports = {
  applyProxyConfig,
};
