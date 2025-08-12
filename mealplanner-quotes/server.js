// server.js
const express = require("express");

const quoteRouter = require("./routes/quoteRoutes");

const app = express();

app.use(express.json());
app.use("/api", quoteRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Quotes microservice listening on http://localhost:${PORT}`);
});
