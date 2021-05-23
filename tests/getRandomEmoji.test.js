const { getRandomEmoji } = require("../util");

test("getRandomEmoji with empty allow, empty block", () => {
  expect(getRandomEmoji([], [])).toBeNull();
});

test("getRandomEmoji with empty allow, emoji block", () => {
  expect(getRandomEmoji([], ["🤪"])).toBeNull();
});

test("getRandomEmoji with allow, empty block", () => {
  expect(getRandomEmoji(["🤪"], [])).toStrictEqual("🤪");
});

test("getRandomEmoji same allow and block", () => {
  expect(getRandomEmoji(["🤪"], ["🤪"])).toBeNull();
});
