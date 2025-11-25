require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3011;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

