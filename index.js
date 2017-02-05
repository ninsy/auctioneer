"use strict";
var config = require("./server/config/config");
var app = require("./server/server");

app.listen(config.port);
console.log(`Magic happens of http://localhost:${config.port}`);
