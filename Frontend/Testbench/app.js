const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const dotenv = require('dotenv').config();

app.get(/^.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, process.env.TESTBENCH + req.url));
});


app.get("/images", (req, res) => {
  res.sendFile(path.join(__dirname, "/css"));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
