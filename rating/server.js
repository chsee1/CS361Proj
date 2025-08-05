// server.js
const express = require("express");
const app = express();
app.use(express.static("public"));
const ratingRoutes = require("./routes/ratings");

app.use(express.json()); // support JSON requests
app.use("/api/ratings", ratingRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Rating service running on http://localhost:${PORT}`);
});
