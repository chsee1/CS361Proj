// server.js
const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.use(express.static("public"));
const ratingRoutes = require("./routes/ratings");

app.use(express.json()); // support JSON requests
app.use("/api/ratings", ratingRoutes);

app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8081/api/quote");
    if (!response.ok) {
      throw new Error(`Microservice returned ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from microservice:", error);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Rating service running on http://localhost:${PORT}`);
});
