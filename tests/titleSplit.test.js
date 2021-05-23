const er = require("emoji-regex/RGI_Emoji.js");
const { titleSplit } = require("../util");

const emojiRegex = er();

test('titleSplit with all text', () => {
    const title = "This is a title";
    expect(titleSplit(title, emojiRegex)).toStrictEqual([title]);
});

test('titleSplit with one emoji + text, no space', () => {
    const title = "🤪This is a title";
    const result = ["🤪", "This is a title"];
    expect(titleSplit(title, emojiRegex)).toStrictEqual(result);
});

test('titleSplit with one emoji + text, space', () => {
    const title = "🤪 This is a title";
    const result = ["🤪", "This is a title"];
    expect(titleSplit(title, emojiRegex)).toStrictEqual(result);
});

test('titleSplit with 2 emoji + text, no space', () => {
    const title = "🤪🤩This is a title";
    const result = ["🤪", "🤩", "This is a title"];
    expect(titleSplit(title, emojiRegex)).toStrictEqual(result);
});

test('titleSplit with 2 emoji + text, space', () => {
    const title = "🤪 🤩 This is a title";
    const result = ["🤪", "🤩", "This is a title"];
    expect(titleSplit(title, emojiRegex)).toStrictEqual(result);
});

test('titleSplit with 3 emojis', () => {
    const title = "🤪🤩🥰";
    const result = ["🤪", "🤩", "🥰"];
    expect(titleSplit(title, emojiRegex)).toStrictEqual(result);
});