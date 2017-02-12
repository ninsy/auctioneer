"use strict";

var Sequelize = require("sequelize");
var config = require("../config/config");

module.exports = new Sequelize(config.databaseUrl, null, null, config.databaseOptions);
