const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

path.join(__dirname, "Lundahl-backup/public_html/");

app.get(/^.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, `Lundahl-backup/homedir/public_html/` + req.url));
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
