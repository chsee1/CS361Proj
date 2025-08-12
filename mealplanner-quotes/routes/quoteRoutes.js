// routes/quoteRoutes.js
const express = require("express");
const { QUOTES, CATEGORIES } = require("../src/quotes");
const { getRandomQuote, lastQuoteCache } = require("../src/utils");

const router = express.Router();

router.get("/quote", (req, res) => {
  const category = (req.query.category || "general").toLowerCase();
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category", allowed: CATEGORIES });
  }
  const quote = getRandomQuote(category, QUOTES, lastQuoteCache);
  res.json({ quote });
});

module.exports = router;
