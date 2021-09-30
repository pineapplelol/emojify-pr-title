const levenshtein = require("fast-levenshtein");

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

const getMappedEmoji = (title, map, blocklist, allEmojis, useFuzzy) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const mapSet of map) {
    const mapKey = Object.keys(mapSet)[0].toLowerCase();
    const caselessTitle = title.toLowerCase();

    if (useFuzzy) {
      const tokens = caselessTitle.split(/[ ,.'"!?-_]/g);

      // eslint-disable-next-line no-restricted-syntax
      for (const token of tokens) {
        const distance = levenshtein.get(mapKey, token);
        if (distance < 3) {
          const emoji = getRandomEmoji(mapSet[mapKey], blocklist);
          return emoji ? `${emoji} ${title}` : null;
        }
      }
    }

    if (caselessTitle.includes(mapKey)) {
      const emoji = getRandomEmoji(mapSet[mapKey], blocklist);
      return emoji ? `${emoji} ${title}` : null;
    }
  }

  return null;
};

const genNewTitle = (
  title,
  useMap,
  map,
  allEmojis,
  blocklist,
  useFuzzy = false
) => {
  if (useMap) {
    return getMappedEmoji(title, map, blocklist, allEmojis, useFuzzy);
  }
  const randomEmoji = getRandomEmoji(allEmojis, blocklist);
  return randomEmoji ? `${randomEmoji} ${title}` : null;
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
  cleanTitle,
  titleSplit,
  getRandomEmoji,
  reduceTitle,
  genNewTitle,
};
