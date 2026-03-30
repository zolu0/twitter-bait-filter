// ==UserScript==
// @name         Twitter Bait Filter
// @namespace    https://github.com/zolu0/twitter-bait-filter
// @version      2.1
// @description  Blocks bait threads on Twitter/X using Unicode, media, and keyword heuristics. Replaces with placeholder.
// @author       zolu647
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zolu647/twitter-bait-filter/main/twitter-bait-filter.user.js
// @downloadURL  https://raw.githubusercontent.com/zolu647/twitter-bait-filter/main/twitter-bait-filter.user.js
// ==/UserScript==

(function () {
  'use strict';

  const BAIT_KEYWORDS = [
    'game of thrones',
    'hot scenes',
    'nsfw',
    'nude',
    'best scenes',
    'sexiest',
    'onlyfans',
    'follow and make my day',
    'say hi',
    'my birthday',
    "i'm ugly",
    'nobody notices',
    "maybe it's because",
    'make my day',
    'fuck it',
    'porn thread',
    'porn',
    'p*rn',
    'booty thread',
  ];

  const WHITELIST_KEYWORDS = [
    'soccer',
    'football',
    'messi',
    'ronaldo',
    'arsenal',
    'man united',
    'premier league',
    'goal',
    'chelsea',
  ];

  const EMOJI_REGEX = /\p{Emoji}/gu;
  const THREAD_REGEX = /\bthread\b/i;

  const normalizeText = (input) =>
    input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^\x00-\x7F]/g, '') // remove other Unicode
      .toLowerCase();

  const isTweetBait = (rawText, tweet) => {
    const text = normalizeText(rawText);
    const hasMedia = tweet.querySelector('img, video, [data-testid="tweetPhoto"], [data-testid="videoPlayer"]') !== null;
    const hasThread = THREAD_REGEX.test(text);
    const hasBaitText = BAIT_KEYWORDS.some((k) => text.includes(k));
    const isWhitelisted = WHITELIST_KEYWORDS.some((k) => text.includes(k));
    // Count emojis on rawText before normalization strips them
    const emojiCount = (rawText.match(EMOJI_REGEX) || []).length;
    const hasTooManyEmojis = emojiCount >= 5;

    if (isWhitelisted) return false;
    return hasThread && hasMedia && (hasBaitText || hasTooManyEmojis);
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

  window.addEventListener('load', () => {
    console.log('✅ Twitter Bait Filter v2.1 loaded');
    processTweets();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
