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

const getRandomEmoji = (allEmojis, blockList) => {
  let allowedEmojis = allEmojis.filter((x) => !blockList.includes(x));
  if (allowedEmojis.length === 0) return null;
  return allowedEmojis[Math.floor(Math.random() * allowedEmojis.length)];
};

const genNewTitle = (title, useMap, map, allEmojis, blocklist) => {
  if (useMap) {
    for (const m of map) {
      const w = Object.keys(m)[0];
      if (title.includes(w)) {
        const emoji = getRandomEmoji(m[w], blocklist);
        return emoji ? emoji + " " + title : null;
      }
    }
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
