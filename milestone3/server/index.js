const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const routes = require('./routes');

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/movies/search/:query", routes.searchMovie);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});