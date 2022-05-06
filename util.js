const axios = require("axios");
const levenshtein = require("fast-levenshtein");

const getJSON = async (url) => {
  return axios
    .get(url)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => {
      throw err;
    });
};

const cleanTitle = (title, blocklist) => {
  let newTitle = title;
  blocklist.forEach((emoji) => {
    newTitle = newTitle.replace(emoji, "");
  });
  return newTitle;
};

const titleSplit = (title, emojiRegex) => {
  const emoji = title.match(emojiRegex);
  const text = title
    .split(emojiRegex)
    .map((s) => s.trim())
    .filter(String);
  const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray));
  return concat(emoji, text);
};

const getRandomEmoji = (allEmojis, blocklist) => {
  const allowedEmojis = allEmojis.filter((emoji) => !blocklist.includes(emoji));
  if (allowedEmojis.length === 0) return null;
  return allowedEmojis[Math.floor(Math.random() * allowedEmojis.length)];
};

const getMappedEmoji = (title, map, blocklist, useFuzzy, defaultEmoji) => {
  const caselessTitle = title.toLowerCase();
  const tokens = caselessTitle.split(/[ ,.'"!?-_]/g);

  for (const token of tokens) {
    for (const mapKey in map) {
      if (useFuzzy) {
        const distance = levenshtein.get(mapKey, token);
        if (distance < 3) {
          const emoji = getRandomEmoji(map[mapKey], blocklist);
          return emoji ? emoji : defaultEmoji;
        }
      }
      if (mapKey.toLowerCase() == token) {
        const emoji = getRandomEmoji(map[mapKey], blocklist);
        return emoji ? emoji : defaultEmoji;
      }
    }
  }

  return defaultEmoji;
};

const genNewTitle = (title, useMap, map, allEmojis, blocklist, useFuzzy = true) => {
  const randomEmoji = getRandomEmoji(allEmojis, blocklist);
  const emoji = useMap ? getMappedEmoji(title, map, blocklist, useFuzzy, randomEmoji) : randomEmoji;
  return emoji ? `${emoji} ${title}` : null;
};

const reduceTitle = (processedTitle, er) => {
  let firstEmoji = "";
  let text = "";
  processedTitle.forEach((token) => {
    const emojiRegex = er();
    if (emojiRegex.test(token)) {
      if (firstEmoji === "") firstEmoji = token;
    } else {
      text += `${token.trim()} `;
    }
  });
  return `${firstEmoji} ${text.trim()}`;
};

module.exports = {
  getJSON,
  cleanTitle,
  titleSplit,
  getRandomEmoji,
  reduceTitle,
  genNewTitle,
};
