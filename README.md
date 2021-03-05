# emojify-pr-title

A GitHub action to ensure that all PRs start with an emoji! If a PR is opened without an emoji, this bot will select an emoji and add it to the beginning of the title. If there are many emojis, it will remove all but the first one. This ensures a clean commit history upon merging.

## Emojis

There are two ways that the bot will choose an emoji.

1. **Emoji Mapping** - based on words that appear in the PR title, it will choose an emoji. For example, if the words 'design' or 'style' appear in the PR title, it will randomly select from the emojis ["🎨", "🧑‍🎨", "🖌️"].

2. **Random Emoji** – will take a random emoji from a list.

### Defaults

By default, the bot will choose to pick a random emoji from the [default generated list](https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emojis.json). It is collected from official [Unicode Emoji 13.0](http://www.unicode.org/emoji/charts-13.0/). A python script will read all fully-qualified emojis from the [official test file](https://unicode.org/Public/emoji/13.0/), and compile them into `emojis/emojis.json`. To run, `python emojis/emoji_parse.py`. Inside the file there is a list of excluded categories which will not include the emojis to the output file.

### Customizing

**Emoji Mapping**

To enable emoji mapping, set the parameter `use-emoji-map` parameter to try like

```
use-emoji-map: true
```

This will enable using emoji mapping with the [default map](https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emoji_mapping.json). To set a custom mapping, add the `emoji-map` parameter with a URL to a JSON file with the format

```
{
  "mapping": [
    {"word": [emojis for the word]}
    ...
  ]
}
```

For example

```
with:
  emoji-map: 'https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emoji_mapping.json'
```

**Custom Emoji List**

A custom random emoji list can be provided by adding the `emoji-list` parameter with a URL to a JSON file with the format

```
{"emojis": [...]}
```

For example

```
with:
  emoji-list: 'https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emojis.json'
```

**Spacing**

Enforcing a single space after the emoji before the text is default. To disable,

```
require-spacing: false
```

### Example Config File

name: Emojify PR Title

on: pull_request

```
jobs:
  emojify-pr-title:
    runs-on: ubuntu-latest
    name: Emojify PR Title
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Emojify PR Title
        uses: pineapplelol/emojify-pr-title@v1.2
        with:
          use-emoji-map: true
```
