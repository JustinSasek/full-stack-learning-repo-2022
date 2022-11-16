// server.js
const express = require("express");

const app = express();

app.get("/config", function (req, res) {
  res.status(200).json({ version: "0.0.1" });
});

app.post("/config", (req, res) => {
  res.status(201).json({ version: "0.0.1" });
})

module.exports = app;
