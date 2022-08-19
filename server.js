const express = require("express");
const dotenv = require("dotenv").config();

const bodyParser = require("body-parser");

const routes = require("./routes");

const db = require("./config/db");
db();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
