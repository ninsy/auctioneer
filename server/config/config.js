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

require("dotenv").config();

console.log(`Pasword: ${process.env}`);

config.databaseName = "aukcje";
config.databaseOptions = {
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};

var envConfig = require("./" + config.env);

module.exports = _.merge(config, envConfig);
