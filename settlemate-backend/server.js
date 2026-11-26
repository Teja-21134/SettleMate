const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const purchaseRoutes = require("./routes/purchases");
const satyavammaRoutes = require("./routes/satyavamma");

const app = express();

app.use(cors());
app.use(express.json());

console.log(
  "MONGODB_URI Exists:",
  !!process.env.MONGODB_URI
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error(
      "MongoDB Error:",
      err
    );
  });

app.get("/", (req, res) => {
  res.send("SettleMate Backend Running");
});

app.use(
  "/api/purchases",
  purchaseRoutes
);

app.use(
  "/api/satyavamma",
  satyavammaRoutes
);

module.exports = app;