# emojify-pr-title

A GitHub action to ensure that all PRs start with an emoji! If a PR is opened without an emoji, this bot will select a random emoji and add it at the beginning of the title. If there are many emojis, it will use the first one. This ensures a clean commit history upon merging.

## Emojis

The emojis are collected from official [Unicode Emoji 13.0](http://www.unicode.org/emoji/charts-13.0/). A python script will read all fully-qualified emojis from the [official test file](https://unicode.org/Public/emoji/13.0/), and compile them into `emojis/emojis.json`. To run, `python emojis/emoji_parse.py`. Inside the file there is a list of excluded categories which will not include the emojis to the output file.

## Building the GitHub Action

Upon editing `index.js`, run `ncc build index.js --license licenses.txt` to generate the `dist` directory for marketplace use.
