"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var DeliveryOption = db.define("DeliveryOption", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      min: 2,
      max: 20
    }
  }
});
