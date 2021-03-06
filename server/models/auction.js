"use strict";

var Sequelize = require("sequelize");
var moment = require("moment");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
  var Auction = sequelize.define("Auction", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          unique: true
      },
      buyoutOption: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
      },
      started: {
          type: Sequelize.DATE,
          defaultValue:Sequelize.NOW
      },
      finishes: {
          type: Sequelize.DATE,
          allowNull: false,
      },
      imageUrl: {
          type: Sequelize.STRING,
          validate: {
              isUrl: true
          }
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
              len: [2,30]
          }
      },
      description: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              len: [2,300]
          }
      },
      viewCounter: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      finished: {
          type:Sequelize.BOOLEAN,
          defaultValue: false
      },
      deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
      },
      authorId: Sequelize.INTEGER,
      paymentId: Sequelize.INTEGER,
      deliveryId: Sequelize.INTEGER,
  },{
      classMethods: {
        associate: function(models) {
          Auction.belongsTo(models.User, {
            foreignKey: "authorId"
          });
          Auction.hasMany(models.Bid, {
              foreignKey: "auctionId"
          });
          Auction.hasMany(models.UserChosenDelivery, { foreignKey: "auctionId", as: "possibleDeliveries"});
          Auction.hasMany(models.UserChosenPayment, { foreignKey: "auctionId",as: "possiblePayments"});
          Auction.belongsToMany(models.Category, {through: models.AuctionCategory});
          Auction.belongsTo(models.Delivery, {foreignKey: "deliveryId", as: "deliveryData"});
          Auction.belongsTo(models.Payment, {foreignKey: "paymentId", as:"paymentData"});
        }
      },
      hooks: {
          beforeUpdate: checkIfBoundsChanged,
          beforeCreate: verifyDates
      }
  });

  function checkIfBoundsChanged(auction, options) {
        if(auction.changed("finishes") || auction.changed("started")) {
          return Sequelize.Promise.reject({status: 400, message: "Both start and finish auction dates are immutable properties"});
      }
  }

  function verifyDates(auction, options) {
      var start = moment(auction.started).format("YYYY-MM-DD HH:mm:ss"),
          end = moment(auction.finishes).format("YYYY-MM-DD HH:mm:ss");
      if(!moment(start).isValid || !moment(end).isValid) {
          return sequelize.Promise.reject({status: 400, message: `Format date restricted to: "YYYY-MM-DD hh:mm:ss`});
      }
      if(moment.unix(auction.started) > moment.unix(auction.finishes)) {
          return Sequelize.Promise.reject({status: 400, message: `Auction cannot finish before its creation time`})
      }
  }

  return Auction;

};

