"use strict";

var Sequelize = require("sequelize");
var config = require("config");

module.exports = new Sequelize(config.databaseUrl, config.databaseOptions);
