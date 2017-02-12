"use strict";

var Sequelize = require("sequelize");
var db = require("./db");

var Delivery = db.define("Delivery", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique: true
  },
  sent: {
    type: Sequelize.BOOLEAN
  },
  cost: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  estimatedDelivery: {
    // TODO: validate delivery time greater than now
    type: Sequelize.DATE
  },
  chosen_delivery_type: {
    type: Sequelize.INTEGER,
    references: {
      model: DeliveryOption,
      key: "id"
    }
  }
});

module.exports = Delivery;
