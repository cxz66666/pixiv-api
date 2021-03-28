const fse = require("fs-extra");
const path = require("path");
let ROOTPATH = "D:\\Compressed\\pixiv-api";
let PRE_URL = "https://raynor.top";

let axios;
const axiosOption = {
  headers: { Referer: "https://www.pixiv.net" },
  responseType: "stream",
};
const setAgent = (agent) => {
  axios = require("axios").create({
    httpsAgent: agent,
    ...axiosOption,
  });
};
const applyRootPath = (rootpath, pre_url) => {
  if (rootpath) ROOTPATH = rootpath;
  if (pre_url) PRE_URL = pre_url;
  return;
};
const saveUrl = async (url) => {
  if (url.indexOf("img-original") === -1) return false;
  let urlObject;
  try {
    urlObject = path.parse(url);
  } catch (error) {
    console.log(error);
    return false;
  }
  let dirUrl = urlObject.dir.substr(urlObject.dir.indexOf("img-original"));
  let absDirPath = path.resolve(ROOTPATH, dirUrl);
  let filename = urlObject.base;
  // console.log(PRE_URL, dirUrl, filename);
  let httpUrl = PRE_URL + dirUrl + "/" + filename;
  let absFilePath = path.join(absDirPath, filename);
  // console.log(absFilePath);
  if (await fse.exists(absFilePath)) return httpUrl;

  await fse.ensureDir(absDirPath);
  const response = await axios.get(url);
  // console.log(absFilePath);
  // console.log(httpUrl);
  response.data.pipe(fse.createWriteStream(absFilePath));
  return httpUrl;
};

module.exports = {
  setAgent,
  saveUrl,
  applyRootPath,
};
