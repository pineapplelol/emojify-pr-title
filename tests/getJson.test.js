const { getJSON } = require("../util");

test("get emoji list", () => {
  getJSON(
    "https://raw.githubusercontent.com/pineapplelol/emojify-pr-title/master/emojis/emojis.json"
  ).then((data) => {
    expect(data.emojis[0]).toStrictEqual("😀");
  });
});
