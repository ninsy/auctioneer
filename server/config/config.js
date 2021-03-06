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
config.gApi = {};

if(config.env ===  config.dev) {
    config.gApi = require("./keys/gapi.json");
} else {
  config.gApi.private_key = process.env.GAPI_PKEY;
  config.gApi.client_email = process.env.GAPI_EMAIL;
}

config.gApi.scopes = ["https://www.googleapis.com/auth/drive"];

config.databaseName = process.env.DB_NAME;
config.databaseOptions = {
  dialect: "mysql",
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  logging: console.log,
  pool: {
    max: 4,
    min: 1,
    idle: 10000
  }
};

var envConfig = require("./" + config.env);

module.exports = _.merge(config, envConfig);
