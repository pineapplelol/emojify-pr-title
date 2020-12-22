const core = require("@actions/core");
const emojiList = require("./emojis/emojis.json");
const emojiMap = require("./emojis/emoji_mapping.json");
const fetch = require("node-fetch");
const github = require("@actions/github");

const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

const titleSplit = (title) => {
  return title
    .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
    .filter((t) => t !== "" && t !== " ");
};

const genNewTitle = (title, useMap, map, allEmojis) => {
  if (useMap) {
    for (const m of map) {
      const w = Object.keys(m)[0];
      if (title.includes(w)) {
        const emoji = m[w][Math.floor(Math.random() * m[w].length)];
        return emoji + " " + title;
      }
    }
  }
  const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  return randomEmoji + " " + title;
};

const reduceTitle = (processedTitle) => {
  let firstEmoji = "";
  let text = "";
  for (let t of processedTitle) {
    if (emojiRegex.test(t) && firstEmoji === "") firstEmoji = t;
    if (!emojiRegex.test(t)) text += t;
  }
  return firstEmoji + " " + text;
};

async function getJSON(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => {
      throw err;
    });
}

async function run() {
  try {
    const inputs = {
      token: core.getInput("github-token", { required: true }),
      emojiList: core.getInput("emoji-list"),
      useEmojiMap: core.getInput("use-emoji-map", { required: true }),
      emojiMap: core.getInput("emoji-map"),
    };

    let allEmojis = [];
    if (inputs.emojiList) {
      const emojiList = await getJSON(inputs.emojiList);
      allEmojis = emojiList["emojis"];
      core.info("Using custom emoji list");
      core.info(allEmojis);
    } else {
      core.info("Using default emoji list");
      allEmojis = emojiList["emojis"];
    }

    let emojiMapToUse = {};
    if (inputs.useEmojiMap && inputs.emojiMap) {
      const map = await getJSON(inputs.emojiMap);
      emojiMapToUse = map["mapping"];
      core.info("Using custom emoji mapping");
      core.info(emojiMapToUse);
    } else {
      core.info("Using default emoji map");
      emojiMapToUse = emojiMap["mapping"];
    }

    const request = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
    };

    const title = github.context.payload.pull_request.title || "";
    const processedTitle = titleSplit(title);
    let newTitle = "";

    let needToUpdateTitle = false;
    if (processedTitle.length == 0) core.warning("No PR title");
    if (processedTitle.length == 1) {
      if (!emojiRegex.test(processedTitle[0])) {
        core.info("Adding emoji");
        needToUpdateTitle = true;
        newTitle = genNewTitle(
          title,
          inputs.useEmojiMap,
          emojiMapToUse,
          allEmojis
        );
      } else core.warning("No PR title text found");
    }
    if (processedTitle.length > 2) {
      core.info("Many emojis found, picking first one");
      needToUpdateTitle = true;
      newTitle = reduceTitle(processedTitle);
    }

    if (needToUpdateTitle) {
      request.title = newTitle;
      core.info(`New title: ${newTitle}`);
    } else {
      core.info("No updates were made to PR title");
    }

    const octokit = github.getOctokit(inputs.token);
    const response = await octokit.pulls.update(request);

    core.info(`Response: ${response.status}`);
    if (response.status !== 200) {
      core.error("Updating the pull request has failed");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
