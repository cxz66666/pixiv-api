const Protocol = require("register-protocol-win32");

const Path = require("path");
const Config = require("./config");

const PROTOCOL_NAME = "pixiv";

const install = async () => {
  const cmd = `"${process.execPath}" "${Path.resolve(
    __dirname,
    "sender.js"
  )}" "%1"`;
  // console.log(cmd);
  const suc = await Protocol.install(PROTOCOL_NAME, cmd)
    .then((_) => true)
    .catch((_) => false);
  if (suc) Config.modify({ registered: true });
  // console.log(suc);
  return suc;
};
const protocolExists = () => Protocol.exists(PROTOCOL_NAME).catch((_) => {});
const canInstall = async () => {
  const exists = await protocolExists();
  if (typeof exists != "boolean") return false;
  return Config.data.registered || !exists;
};

const unInstall = async () => {
  const success = await Protocol.uninstall(PROTOCOL_NAME)
    .then((_) => true)
    .catch((_) => false);
  if (success) Config.modify({ registered: false });
  return success;
};

module.exports = {
  install,
  unInstall,
  canInstall,
  exists: protocolExists,
};
