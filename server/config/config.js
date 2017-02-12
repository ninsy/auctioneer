"use strict";

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

config.databaseUrl = "localhost:3306/aukcje";
config.databaseOptions = {
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

var envConfig = require("./" + config.env);

module.exports = Object.assign(config, envConfig);
