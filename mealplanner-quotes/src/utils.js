// src/utils.js
// Utility to return non-repeating random quotes

const lastQuoteCache = {};

function getRandomQuote(category, quotesObject, cache) {
  const options = quotesObject[category] || [];
  if (options.length === 0) return "";

  const last = cache[category];
  let pick = options[Math.floor(Math.random() * options.length)];
  let guard = 0;
  while (options.length > 1 && pick === last && guard < 10) {
    pick = options[Math.floor(Math.random() * options.length)];
    guard++;
  }

  cache[category] = pick;
  return pick;
}

module.exports = { lastQuoteCache, getRandomQuote };
