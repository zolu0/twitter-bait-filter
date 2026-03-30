// ==UserScript==
// @name         Twitter Bait Filter
// @namespace    https://github.com/zolu0/twitter-bait-filter
// @version      2.3
// @description  Blocks bait threads on Twitter/X using Unicode, media, and keyword heuristics. Replaces with placeholder.
// @author       zolu0
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zolu0/twitter-bait-filter/main/twitter-bait-filter.user.js
// @downloadURL  https://raw.githubusercontent.com/zolu0/twitter-bait-filter/main/twitter-bait-filter.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Always block with media — these are unambiguous
  const EXPLICIT_KEYWORDS = [
    'nsfw',
    'nude',
    'porn',
    'p*rn',
    'onlyfans',
    'only fans',
    'xxx',
  ];

  // Block with media — bait content but slightly more context-dependent
  const BAIT_KEYWORDS = [
    'hot scenes',
    'best scenes',
    'sexiest',
    'body count',
    'booty thread',
    'porn thread',
    'booty',
  ];

  // Only block with media + emojis — too ambiguous on their own
  const ENGAGEMENT_BAIT_KEYWORDS = [
    'follow and make my day',
    'make my day',
    'say hi',
    'my birthday',
    "i'm ugly",
    'nobody notices',
    "maybe it's because",
    'fuck it',
  ];

  const EMOJI_REGEX = /\p{Emoji}/gu;
  const normalizeText = (input) =>
    input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^\x00-\x7F]/g, '') // remove other Unicode
      .toLowerCase();

  const isTweetBait = (rawText, tweet) => {
    const text = normalizeText(rawText);
    const hasMedia =
      tweet.querySelector(
        'img, video, [data-testid="tweetPhoto"], [data-testid="videoPlayer"]',
      ) !== null;

    if (!hasMedia) return false;

    // Count emojis on rawText before normalization strips them
    const emojiCount = (rawText.match(EMOJI_REGEX) || []).length;
    const hasTooManyEmojis = emojiCount >= 5;

    if (EXPLICIT_KEYWORDS.some((k) => text.includes(k))) return true;
    if (BAIT_KEYWORDS.some((k) => text.includes(k))) return true;
    if (
      ENGAGEMENT_BAIT_KEYWORDS.some((k) => text.includes(k)) &&
      hasTooManyEmojis
    )
      return true;

    return false;
  };

  const processTweets = () => {
    document.querySelectorAll('article').forEach((tweet) => {
      const rawText = tweet.innerText || '';
      if (isTweetBait(rawText, tweet)) {
        console.log(
          '🛑 Blocked tweet:',
          rawText.slice(0, 150).replace(/\n/g, ' '),
        );

        tweet.innerHTML = `
                  <div style="
                      padding: 16px;
                      margin: 8px;
                      color: #ff4d4d;
                      background: #1e1e1e;
                      border: 1px solid #444;
                      border-radius: 8px;
                      font-weight: bold;
                      font-family: sans-serif;
                      text-align: center;
                      font-size: 14px;
                  ">
                      🚫 Blocked Tweet (Unicode/Media Bait Detected)
                  </div>
              `;
      }
    });
  };

  const observer = new MutationObserver(() => {
    processTweets();
  });

  console.log('Twitter Bait Filter v2.3 loaded');
  processTweets();
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
