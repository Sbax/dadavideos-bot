const youtubedl = require("youtube-dl-exec");

const getInfo = (url) =>
  youtubedl(url, {
    skipDownload: true,
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
  });

const getIdFromUrl = (url) => {
  /**
   * Reworked code from https://gist.github.com/takien/4077195
   * @author: takien
   * @url: http://takien.com
   */
  const parsedUrl = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

  if (!parsedUrl[2]) return null;

  const [id] = parsedUrl[2].split(/[^0-9a-z_\-]/i);
  return id;
};

module.exports = {
  getInfo,
  getIdFromUrl,
};
