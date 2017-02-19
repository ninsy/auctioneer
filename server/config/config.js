"use strict";
var path = require("path");
var _ = require("lodash");

require("dotenv").config();

var config = {
  dev: "development",
  prod: "production",
  port: process.env.PORT || 3000,
  expireTime: 24 * 60 * 10,
  secrets: {
    jwt: process.env.JWT || "secret123"
  },
  googleCredentials: {
    email: process.env.GAPI_EMAIL,
    scopes: ["https://www.googleapis.com/auth/drive"],
    keyFile: path.join(appRoot, "server/config/keys/gapi_key.pem")
  }
};

config.env = process.env.NODE_ENV || config.dev;

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
