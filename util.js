const levenshtein = require("fast-levenshtein");

const cleanTitle = (title, blocklist) => {
  let newTitle = title;
  for (let e of blocklist) newTitle = newTitle.replace(e, "");
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
  for (const m of map) {
    const mapKey = Object.keys(m)[0];

    if (useFuzzy) {
      const words = title.split(/[ ,.'"!?-_]/g);
      for (const word of words) {
        if (levenshtein.get(mapKey, word) < 3) {
          const emoji = getRandomEmoji(m[mapKey], blocklist);
          return emoji ? emoji + " " + title : null;
        }
      }
      return getRandomEmoji(allEmojis, blocklist);
    }

    if (title.includes(mapKey)) {
      const emoji = getRandomEmoji(m[mapKey], blocklist);
      return emoji ? emoji + " " + title : null;
    }
  }
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
  return randomEmoji ? randomEmoji + " " + title : null;
};

const reduceTitle = (processedTitle, er) => {
  let firstEmoji = "";
  let text = "";
  for (let t of processedTitle) {
    const emojiRegex = er();
    if (emojiRegex.test(t)) {
      if (firstEmoji === "") firstEmoji = t;
    } else {
      text += `${t.trim()} `;
    }
  }
  return firstEmoji + " " + text.trim();
};

module.exports = {
  cleanTitle,
  titleSplit,
  getRandomEmoji,
  reduceTitle,
  genNewTitle,
};
