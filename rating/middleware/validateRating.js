// rating/middleware/validateRating.js
const validateRating = (req, res, next) => {
  const { drivewayId, userId, stars } = req.body ?? {};
  const errors = [];

  // drivewayId: positive integer
  if (!Number.isInteger(drivewayId) || drivewayId < 1) {
    errors.push("drivewayId must be a positive integer");
  }

  // userId: integer 0–9 (must be < 10 per contract)
  if (!Number.isInteger(userId) || userId < 0 || userId >= 10) {
    errors.push("userId must be an integer less than 10");
  }

  // stars: integer 1–5
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    errors.push("stars must be an integer between 1 and 5");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateRating;
