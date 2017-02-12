"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var Auction = db.define("Auction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  author_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  },
  started: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finishes: {
    // TODO: validate that it is greater than started
    type: Sequelize.DATE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  finished: {
    type: Sequelize.BOOLEAN
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 2,
      max: 30
    }
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 2,
      max: 300
    }
  },
});
