"use strict";
var _ = require("lodash");

require("dotenv").config();

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

if(config.env === config.dev) {
    config.gApi = require("./keys/gapi.json");
} else {
  // TODO: check if appropriate env variable is present, then assign them to gApi object
  // TODO:    example: config.gApi.client_email = process.env.GAPI_MAIL
}

config.gApi.scopes = ["https://www.googleapis.com/auth/drive"];

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
