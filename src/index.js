const {
  listenToMessages,
  tagMessage,
  getLatestMessagesInChannel,
} = require("./discord-bot");
const { getInfo, getIdFromUrl } = require("./youtube");

require("dotenv").config();

const findYoutubeUrls = (string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const foundUrls = string.match(urlRegex) || [];
  return foundUrls.filter(Boolean);
};

const checkForCopyright = async (urls) => {
  const infos = await Promise.all(urls.map((url) => getInfo(url)));
  return infos.some(({ artist }) => !!artist);
};

const checkForDuplicates = async (urls) => {
  const ids = urls.map(getIdFromUrl).filter(Boolean);

  const existingIds = (await getLatestMessagesInChannel())
    .map(({ content }) => findYoutubeUrls(content))
    .flat()
    .map(getIdFromUrl)
    .filter(Boolean);

  return ids.some(
    (id) => existingIds.filter((existingId) => existingId === id).length > 1
  );
};

(() => {
  listenToMessages(async (message) => {
    const { content } = message;
    const urls = findYoutubeUrls(content);

    const copyright = await checkForCopyright(urls);
    if (copyright) tagMessage(message, "©");

    const duplicate = await checkForDuplicates(urls);
    if (duplicate) tagMessage(message, "👀");
  });
})();
