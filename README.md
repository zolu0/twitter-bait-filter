# Twitter Bait Filter

![version](https://img.shields.io/badge/version-2.3-blue)

Blocks low-effort, NSFW, and engagement-farming posts on Twitter/X and replaces them with a placeholder.

**Catches:**
- Explicit content (porn, nsfw, nude, onlyfans)
- Bait media posts (hot scenes, body count, booty, etc.)
- Engagement farming with emojis ("say hi", "nobody notices me", etc.)

---

## Install

You'll need one of these browser extensions first:

- [Tampermonkey](https://www.tampermonkey.net/) (recommended, Chrome, Firefox, Edge)
- [Violentmonkey](https://violentmonkey.github.io/) (open source alternative)

Then install the script:

- [Install via GreasyFork](https://greasyfork.org/en/scripts/535056-twitter-bait-filter) (auto-updates)
- [Install from GitHub](https://github.com/zolu0/twitter-bait-filter/raw/main/twitter-bait-filter.user.js)

---

## How It Works

The script scans tweets for three tiers of signals combined with media detection:

- **Explicit keywords**: blocked immediately if media is present
- **Bait keywords**: blocked if media is present
- **Engagement bait keywords**: blocked only if media and 5+ emojis are present

Matched tweets are replaced with a red placeholder box.

---

## Customize

Open the script in Tampermonkey and edit the keyword lists at the top:

```js
const EXPLICIT_KEYWORDS = [ ... ];
const BAIT_KEYWORDS = [ ... ];
const ENGAGEMENT_BAIT_KEYWORDS = [ ... ];
```
