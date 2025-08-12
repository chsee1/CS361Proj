// rating/server.js
const express = require("express");
const app = express();

app.use(express.static("public")); // keep if you actually serve anything from /public
app.use(express.json()); // support JSON requests

const ratingRoutes = require("./routes/ratings");
app.use("/api/ratings", ratingRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Rating service running on http://localhost:${PORT}`);
});
