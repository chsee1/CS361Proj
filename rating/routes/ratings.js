const express = require("express");
const router = express.Router();
const db = require("../db");

// 🔒 POST: Submit or update a rating
router.post("/", (req, res) => {
  const { drivewayId, userId, stars } = req.body;

  console.log("🔍 Incoming POST body:", req.body);

  // ✅ Security and input validation
  if (!drivewayId || !userId || userId > 10|| stars < 1 || stars > 5) {
    return res.status(401).json({ error: "Unauthorized or invalid input" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO ratings (drivewayId, userId, stars)
      VALUES (?, ?, ?)
      ON CONFLICT(drivewayId, userId) DO UPDATE SET stars=excluded.stars
    `);
    stmt.run(drivewayId, userId, stars);

    console.log(`✅ Saved rating: ${stars}★ for driveway ${drivewayId} by user ${userId}`);
    res.status(200).json({ message: "Rating saved" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ⚡ GET: Retrieve average rating and vote count
router.get("/:drivewayId", (req, res) => {
  const drivewayId = parseInt(req.params.drivewayId);

  console.time(`GET /api/ratings/${drivewayId}`);
  try {
    const { average, total } = db.prepare(`
      SELECT AVG(stars) as average, COUNT(*) as total
      FROM ratings WHERE drivewayId = ?
    `).get(drivewayId);

    console.timeEnd(`GET /api/ratings/${drivewayId}`);

    res.json({
      average: average ? parseFloat(average).toFixed(1) : "0.0",
      totalVotes: total || 0
    });
  } catch (err) {
    console.error("❌ GET failed:", err);
    res.status(500).json({ error: "Failed to retrieve ratings" });
  }
});

module.exports = router;
