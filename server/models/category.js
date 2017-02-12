"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var Category = db.define("Category", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 2,
      max: 40
    }
  }
});

module.exports = Category;
