const { cleanTitle } = require("../util");
const blockListJSON = require("../emojis/blocklist.json");
const blocklist = blockListJSON["blocklist"];

test('cleanTitle with all text, no blocklist', () => {
    const title = "This is a title";
    expect(cleanTitle(title, [])).toBe(title);
});

test('cleanTitle with text + emojis, no blocklist', () => {
    const title = "👁‍🗨🗨This is a title";
    expect(cleanTitle(title, [])).toBe(title);
});

test('cleanTitle with emojis, no blocklist', () => {
    const title = "👁‍🗨🗨";
    expect(cleanTitle(title, [])).toBe(title);
});

test('cleanTitle with all text, default blocklist', () => {
    const title = "This is a title";
    expect(cleanTitle(title, blocklist)).toBe(title);
});

test('cleanTitle with text + emojis, no blocklist', () => {
    const title = "👁‍🗨🗨This is a title";
    const cleanedTitle = "This is a title";
    expect(cleanTitle(title, blocklist)).toBe(cleanedTitle);
});

test('cleanTitle with emojis, no blocklist', () => {
    const title = "👁‍🗨🗨";
    const cleanedTitle = "";
    expect(cleanTitle(title, blocklist)).toBe(cleanedTitle);
});