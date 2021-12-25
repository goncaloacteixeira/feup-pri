const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const routes = require('./routes');

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

/**
 * GET /api/movies
 *
 * parameters:
 *  - query: search on original_title, title, plot and description
 *  - language: search on language
 *
 */

app.get("/api/movies", routes.searchMovie);

app.get("/api/poster/:id", routes.getPoster);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});