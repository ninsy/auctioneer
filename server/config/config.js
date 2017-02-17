"use strict";
var path = require("path");
var _ = require("lodash");
var config = {
  dev: "development",
  prod: "production",
  port: process.env.PORT || 3000,
  expireTime: 24 * 60 * 10,
  secrets: {
    jwt: process.env.JWT || "secret123"
  }
};

config.env = process.env.NODE_ENV || config.dev;
// config.logFile = path.join(__dirname, )

config.databaseName = "aukcje";
config.databaseOptions = {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  logging: false,
  user: "root",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};

var envConfig = require("./" + config.env);

module.exports = _.merge(config, envConfig);
