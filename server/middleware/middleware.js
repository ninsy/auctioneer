"use strict";
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");

var config = require(path.join(NODE_ROOT  + "/config/config"));

module.exports = function(app) {


  var logFileStream = fs.createWriteStream(config.logFile);

  app.use(morgan("dev", {stream: logFileStream}));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cors());

}
