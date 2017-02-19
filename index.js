"use strict";

var path = require("path");
global.appRoot = path.resolve(__dirname);


var config = require("./server/config/config");
var app = require("./server/server");

app.listen(config.port);
console.log(`Magic happens on http://localhost:${config.port}`);
