# 🧹 Twitter Bait Filter

[![GreasyFork Version](https://img.shields.io/badge/GreasyFork-2.0-red?logo=greasyfork)](https://greasyfork.org/en/scripts/535056-twitter-bait-filter)
[![GitHub Version](https://img.shields.io/badge/version-2.0-blue)](https://github.com/nabil647/twitter-bait-filter)

Blocks low-effort, NSFW, and engagement-farming “A Thread” posts on Twitter/X.

**No more:**  
- "say hi" thirst traps  
- AI model bait  
- Unicode-obfuscated `𝘁𝗵𝗿𝘦𝗮𝗱` spam  
- Emotional clickbait like “no one notices me 😢”  
- Obvious NSFW/porn-style media threads  

Instead, those tweets are replaced with:

> 🚫 Blocked Tweet (Media or Text Bait Detected)

---

## 📦 Install

To use this script, install one of the following browser extensions:

- [Tampermonkey](https://www.tampermonkey.net/) (Recommended – Chrome, Firefox, Edge)
- [Violentmonkey](https://violentmonkey.github.io/) (Open source alternative)



Once installed, you can:

- 🔴 [🔴 Install via GreasyFork ⚡ *(auto-updates)*](https://greasyfork.org/en/scripts/535056-twitter-bait-filter)
- 🟢 [Install directly from GitHub](https://github.com/nabil647/twitter-bait-filter/raw/main/twitter-bait-filter.user.js)

---

## 💡 How It Works

This userscript uses **Unicode normalization**, **emoji detection**, **keyword filtering**, and **media checks** to remove:

- Tweets that mention "thread" (even in obfuscated Unicode)
- Tweets with embedded images or video + bait text
- Emotional manipulation tweets like “say hi”, “follow & make my day”
- NSFW bait like "best scenes", "onlyfans", etc.

### ✅ Whitelist-Safe
Legit content like:
- `soccer thread`, `football news`, `goal highlights`
...will **still appear** via a smart whitelist.

---

## 🛠 Customize It

Want to allow or block different content?

Open the script in Tampermonkey and edit:

```js
const BAIT_KEYWORDS = [ ... ];
const WHITELIST_KEYWORDS = [ ... ];
```
