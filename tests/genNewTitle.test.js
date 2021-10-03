/* eslint-disable no-undef */
const { genNewTitle } = require("../util");

test("genNewTitle with empty allow empty block", () => {
  const title = "This is a title";
  const useMap = false;
  const map = {};
  expect(genNewTitle(title, useMap, map, [], [])).toBeNull();
});

test("genNewTitle with empty allow emoji block", () => {
  const title = "This is a title";
  const useMap = false;
  const map = {};
  expect(genNewTitle(title, useMap, map, [], ["🤪"])).toBeNull();
});

test("genNewTitle with emoji allow empty block", () => {
  const title = "This is a title";
  const useMap = false;
  const map = {};
  const newTitle = "🤪 This is a title";
  expect(genNewTitle(title, useMap, map, ["🤪"], [])).toStrictEqual(newTitle);
});

test("genNewTitle with map, allow, full block", () => {
  const title = "This is a title";
  const useMap = true;
  const map = { title: ["🤪"] };
  expect(genNewTitle(title, useMap, map, ["🤪"], ["🤪"])).toBeNull();
});

test("genNewTitle with map, allow, empty block", () => {
  const title = "This is a title";
  const useMap = true;
  const map = { title: ["🤪"] };
  const newTitle = "🤪 This is a title";
  expect(genNewTitle(title, useMap, map, ["🤪"], [])).toStrictEqual(newTitle);
});

test("genNewTitle with map, empty allow, empty block", () => {
  const title = "This is a title";
  const useMap = true;
  const map = { title: ["🤪"] };
  const newTitle = "🤪 This is a title";
  expect(genNewTitle(title, useMap, map, [], [])).toStrictEqual(newTitle);
});

test("genNewTitle with map, with fuzzy match at tolerance", () => {
  const title = "This is a tetles";
  const useMap = true;
  const map = { title: ["🤪"] };
  const newTitle = "🤪 This is a tetles";
  expect(genNewTitle(title, useMap, map, [], [], true)).toStrictEqual(newTitle);
});

test("genNewTitle with map, with fuzzy match above tolerance", () => {
  const title = "This is a teales";
  const useMap = true;
  const map = { title: ["🤪"] };
  expect(genNewTitle(title, useMap, map, [], [], true)).toBeNull();
});
