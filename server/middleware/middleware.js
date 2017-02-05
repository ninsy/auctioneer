"use strict";
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");

var logFile = path.join(NODE_ROOT, "/server/util/logs.txt");

module.exports = function(app) {
  var logFileStream = fs.createWriteStream(logFile);

  app.use(morgan("dev", {stream: logFileStream}));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cors());

}
