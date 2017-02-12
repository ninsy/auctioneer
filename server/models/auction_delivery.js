"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var AuctionDelivery = db.define("AuctionDelivery", {
  delivery_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Delivery,
      key: "id"
    }
  },
  auction_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Auction,
      key: "id"
    }
  }
});
