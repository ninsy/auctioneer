"use strict";
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");

var config = require("../config/config");

module.exports = function(app) {

  // TODO: setup NODE_ROOT properly and use it inside config to reference that txt file
  // var logFileStream = fs.createWriteStream(config.logFile);

  app.use(morgan("dev" /*{stream: logFileStream}*/));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cors());

}
