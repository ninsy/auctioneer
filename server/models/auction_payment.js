"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var AuctionPayment = db.define("AuctionPayment", {
  payment_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Payment,
      key: "id"
    }
  },
  auction_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Auction,
      key: "id"
    }
  },
  booked: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = AuctionPayment;
