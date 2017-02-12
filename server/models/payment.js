"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var Payment = db.define("Payment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});
