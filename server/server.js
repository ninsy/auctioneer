"use strict";
var express = require("express");
var app = express();
var api = require("./api/api");
var config = require("./config/config");
var auth = require("./auth/routes");
var path = require("path");

require("./middleware/middleware")(app);

app.use("/api", api);
app.use("/auth", auth);

app.use(function(err, req, res, next) {
  console.error(err);
  if(err.errors) {
    // SequelizeError
      err.status = 400;
      for(var i = 0; i < err.errors.length; i++) {
        err.message += ` ${err.errors[i].message}, provided: ${err.errors[i].value} ;`;
      }
  }
  res.status(err.status ? err.status : 500).json({
    message: err.message ? err.message : "Internal server error",
    stack: err.stack
      // stack: config.env === config.dev ? err.stack : "Stack only provided in development environment"
  });
});

module.exports = app;
