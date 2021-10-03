const core = require("@actions/core");
const { Octokit } = require("@octokit/action");
const github = require("@actions/github");
const er = require("emoji-regex");
const emojiList = require("./emojis/emojis.json");
const emojiMap = require("./emojis/emoji_mapping.json");
const {
  getJSON,
  cleanTitle,
  titleSplit,
  reduceTitle,
  genNewTitle,
} = require("./util");

const emojiRegex = er();
const octokit = new Octokit();

async function run() {
  try {
    const inputs = {
      requireSpace: core.getInput("require-space"),
      emojiList: core.getInput("emoji-list"),
      blockList: core.getInput("blocklist"),
      useEmojiMap: core.getInput("use-emoji-map", { required: true }),
      emojiMap: core.getInput("emoji-map"),
      useFuzzy: core.getInput("use-fuzzy"),
    };

    let allEmojis = [];
    if (inputs.emojiList) {
      const emojiListJSON = await getJSON(inputs.emojiList);
      allEmojis = emojiListJSON.emojis;
      core.info("Using custom emoji list");
      core.info(allEmojis);
    } else {
      core.info("Using default emoji list");
      allEmojis = emojiList.emojis;
    }

    let blocklist = [];
    if (inputs.blockList) {
      const blocklistJSON = await getJSON(inputs.blockList);
      blocklist = blocklistJSON.blocklist;
      core.info("Using custom blocklist");
      core.info(blocklist);
    } else {
      core.info("No blocklist provided");
    }

    let emojiMapToUse = {};
    if (inputs.useEmojiMap && inputs.emojiMap) {
      const map = await getJSON(inputs.emojiMap);
      emojiMapToUse = map.mapping;
      core.info("Using custom emoji mapping");
      core.info(emojiMapToUse);
    } else {
      core.info("Using default emoji map");
      emojiMapToUse = emojiMap.mapping;
    }

    const request = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
    };

    const { title } = github.context.payload.pull_request;
    const cleanedTitle =
      cleanTitle(github.context.payload.pull_request.title, blocklist) || "";
    if (cleanedTitle !== title) core.info("Blocked emojis found, removing!");
    const processedTitle = titleSplit(title, er());
    let newTitle = "";

    let needToUpdateTitle = false;
    if (processedTitle.length === 0) core.warning("No PR title");
    if (processedTitle.length === 1) {
      if (!emojiRegex.test(processedTitle[0])) {
        core.info("Adding emoji");
        needToUpdateTitle = true;
        newTitle = genNewTitle(
          title,
          inputs.useEmojiMap,
          emojiMapToUse,
          allEmojis,
          blocklist,
          inputs.useFuzzy
        );
        if (!newTitle) core.error("No eligible emojis");
      } else core.warning("No PR title text found");
    }
    if (inputs.requireSpace && processedTitle.length === 2) {
      newTitle = `${processedTitle[0]} ${processedTitle[1]}`;
      needToUpdateTitle = newTitle !== title;
      if (needToUpdateTitle) core.info("Inserting space");
    }
    if (processedTitle.length > 2) {
      core.info("Many emojis found, picking first one");
      needToUpdateTitle = true;
      newTitle = reduceTitle(processedTitle, er);
    }

    if (needToUpdateTitle) {
      request.title = newTitle;
      const response = await octokit.pulls.update(request);
      core.info(`Response: ${response.status}`);
      if (response.status !== 200) {
        core.error("Updating the pull request has failed");
      } else {
        core.info(`New title: ${newTitle}`);
      }
    } else {
      core.info("No updates were made to PR title");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
