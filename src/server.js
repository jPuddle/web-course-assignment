const express = require("express");
const { nanoid } = require("@reduxjs/toolkit");
const app = express();

app.get("/ping", (req, res) => {
  res.json({ pong: nanoid() });
});

app.listen(8080);
