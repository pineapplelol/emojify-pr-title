const core = require("@actions/core");
const emojiList = require("./emojis/emojis.json");
const emojiMap = require("./emojis/emoji_mapping.json");
const fetch = require("node-fetch");
const github = require("@actions/github");
const er = require("emoji-regex/RGI_Emoji.js");

const emojiRegex = er();

const titleSplit = (title) => {
  const emoji = title.match(emojiRegex);
  const text = title
    .split(emojiRegex)
    .map((s) => s.trim())
    .filter(String);
  return [...emoji, ...text];
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
    else if (!emojiRegex.test(t)) text += t;
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
