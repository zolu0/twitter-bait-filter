// ==UserScript==
// @name         Twitter Bait Filter
// @namespace    https://github.com/zolu0/twitter-bait-filter
// @version      2.7
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

  const EXPLICIT_KEYWORDS = [
    'nsfw',
    'nude',
    'porn',
    'p*rn',
    'onlyfans',
    'only fans',
  ];

  const BAIT_KEYWORDS = [
    'hot scenes',
    'best scenes',
    'sexiest',
    'body count',
    'booty thread',
    'porn thread',
    'booty',
    'show more',
  ];

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

  const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

  const normalizeText = (input) =>
    input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x00-\x7F]/g, '')
      .toLowerCase();

  const getTweetText = (tweet) => {
    const textEl = tweet.querySelector('[data-testid="tweetText"]');
    return textEl ? textEl.innerText : '';
  };

  const isTweetBait = (rawText, tweet) => {
    const text = normalizeText(rawText);
    const hasMedia =
      tweet.querySelector(
        'img, video, [data-testid="tweetPhoto"], [data-testid="videoPlayer"]',
      ) !== null;

    if (!hasMedia) return false;

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

  const blockTweet = (tweet, rawText) => {
    const originalHTML = tweet.innerHTML;
    tweet.dataset.baitFiltered = 'true';
    console.log('Blocked tweet:', rawText.slice(0, 150).replace(/\n/g, ' '));

    const div = document.createElement('div');
    div.style.cssText = `
      padding: 16px;
      margin: 8px;
      color: #888;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 8px;
      font-family: sans-serif;
      text-align: center;
      font-size: 14px;
    `;

    const label = document.createElement('span');
    label.textContent = 'Blocked Tweet';

    const btn = document.createElement('button');
    btn.textContent = 'Show anyway';
    btn.style.cssText = `
      margin-left: 12px;
      background: none;
      border: 1px solid #555;
      border-radius: 4px;
      color: #aaa;
      font-size: 12px;
      padding: 2px 8px;
      cursor: pointer;
    `;
    const showPlaceholder = () => {
      tweet.dataset.baitFiltered = 'true';
      tweet.innerHTML = '';
      tweet.appendChild(div);
    };

    btn.addEventListener('click', () => {
      if (tweet.dataset.baitFiltered === 'shown') {
        showPlaceholder();
      } else {
        tweet.dataset.baitFiltered = 'shown';
        tweet.innerHTML = originalHTML;
        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'Hide';
        hideBtn.style.cssText = btn.style.cssText;
        hideBtn.addEventListener('click', showPlaceholder);
        tweet.prepend(hideBtn);
      }
    });

    div.appendChild(label);
    div.appendChild(btn);
    tweet.innerHTML = '';
    tweet.appendChild(div);
  };

  const processTweets = () => {
    document.querySelectorAll('article').forEach((tweet) => {
      if (tweet.dataset.baitFiltered) return;

      const rawText = getTweetText(tweet);
      if (!rawText) return;

      if (isTweetBait(rawText, tweet)) {
        blockTweet(tweet, rawText);
      }
    });
  };

  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processTweets, 200);
  });

  console.log('Twitter Bait Filter loaded');
  processTweets();
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
