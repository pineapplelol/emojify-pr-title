import json
import urllib.request

data = urllib.request.urlopen("https://unicode.org/Public/emoji/13.0/emoji-test.txt")

excluded_subgroups = [
    "warning",
    "arrow",
    "religion",
    "zodiac",
    "av-symbol",
    "gender",
    "math",
    "punctuation",
    "currency",
    "other-symbol",
    "keycap",
    "alphanum",
    "geometric",
    "flag",
    "country-flag",
    "subdivision-flag",
]

fully_qualified = "; fully-qualified"
subgroup_prefix = "# subgroup: "
subgroup = ""

emojis = []

for line in data:
    line = line.decode('utf-8')
    if line.startswith(subgroup_prefix):
        subgroup = line[len(subgroup_prefix) :].strip()
    if fully_qualified in line and subgroup not in excluded_subgroups:
        emojis.append(line[line.find("#") :][2])


data = {"emojis": emojis}

with open("emojis/emojis.json", "w") as f:
    json.dump(data, f, ensure_ascii=False)
