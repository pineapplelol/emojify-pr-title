# emojify-pr-title

A GitHub action to ensure that all PRs start with an emoji! If a PR is opened without an emoji, this bot will select a random emoji and add it at the beginning of the title. If there are many emojis, it will use the first one. This ensures a clean commit history upon merging.

## Emojis

The emojis are collected from official [Unicode Emoji 13.0](http://www.unicode.org/emoji/charts-13.0/). A python script will read all fully-qualified emojis from the [official test file](https://unicode.org/Public/emoji/13.0/), and compile them into `emojis/emojis.json`. To run, `python emojis/emoji_parse.py`. Inside the file there is a list of excluded categories which will not include the emojis to the output file.

A custom emoji list can be provided by adding the `emoji-list` parameter with a URL to a JSON file with the format

```
{"emojis": [...]}
```

For example

```
with:
  emoji-list: 'https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emojis.json'
```
