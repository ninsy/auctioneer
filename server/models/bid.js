"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var Bid = db.define("Bid", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  auction_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Auction,
      key: "id"
    }
  },
  author_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  },
  value: {
    // TODO: trigger which checks whterher value is greater than / equal current maximum | buyout
    type: Sequelize.INTEGER,
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});
