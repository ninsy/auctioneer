"use strict";
var express = require("express");
var app = express();
var api = require("./api/api");
var config = require("./config/config");
var auth = require("./auth/routes");

require("./middleware/middleware")(app);

app.use("/api", api);
app.use("/auth", auth);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({message: "Internal server error", stack: err.stack});
})

module.exports = app;
