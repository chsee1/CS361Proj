// rating/routes/ratings.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const validateRating = require("../middleware/validateRating");

// 🔒 POST: Submit or update a rating
router.post("/", validateRating, (req, res) => {
  const { drivewayId, userId, stars } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO ratings (drivewayId, userId, stars)
      VALUES (?, ?, ?)
      ON CONFLICT(drivewayId, userId) DO UPDATE SET stars = excluded.stars
    `);
    stmt.run(drivewayId, userId, stars);

    res.status(200).json({ message: "Rating saved" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ⚡ GET: Retrieve average rating and vote count
router.get("/:drivewayId", (req, res) => {
  const drivewayId = Number.parseInt(req.params.drivewayId, 10);

  if (!Number.isInteger(drivewayId)) {
    return res.status(400).json({ error: "drivewayId must be an integer" });
  }

  console.time(`GET /api/ratings/${drivewayId}`);
  try {
    const { average, total } = db
      .prepare(
        `
      SELECT AVG(stars) AS average, COUNT(*) AS total
      FROM ratings
      WHERE drivewayId = ?
    `
      )
      .get(drivewayId);

    console.timeEnd(`GET /api/ratings/${drivewayId}`);

    res.json({
      average: average ? Number.parseFloat(average).toFixed(1) : "0.0",
      totalVotes: total || 0,
    });
  } catch (err) {
    console.error("❌ GET failed:", err);
    res.status(500).json({ error: "Failed to retrieve ratings" });
  }
});

module.exports = router;
