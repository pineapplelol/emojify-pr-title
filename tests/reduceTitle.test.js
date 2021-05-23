const er = require("emoji-regex/RGI_Emoji.js");
const { reduceTitle } = require("../util");

test("reduceTitle with one emoji, text end no space", () => {
  const processedTitle = ["🤪", "This is a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with one emoji, text end space", () => {
  const processedTitle = ["🤪", "This is a title "];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with 2 emoji, text end no space", () => {
  const processedTitle = ["🤪", "🥰", "This is a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with 2 emoji, text end space", () => {
  const processedTitle = ["🤪", "🥰", "This is a title "];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with one emoji, text mix, no space", () => {
  const processedTitle = ["This", "🤪", "is a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with one emoji, text mix, space front", () => {
  const processedTitle = [" This", "🤪", " is a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with one emoji, text mix, space end", () => {
  const processedTitle = ["This ", "🤪", "is a title "];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with 2 emoji, text mix, no space", () => {
  const processedTitle = ["This", "🤪", "is", "🥰", "a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with 2 emoji, text mix, space front", () => {
  const processedTitle = [" This", "🤪", " is", "🥰", " a title"];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});

test("reduceTitle with 2 emoji, text mix, space end", () => {
  const processedTitle = ["This ", "🤪", "is ", "🥰", "a title "];
  const reducedTitle = "🤪 This is a title";
  expect(reduceTitle(processedTitle, er)).toStrictEqual(reducedTitle);
});
