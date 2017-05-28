"use strict";

var Sequelize = require("sequelize");
var models = require("./db");


module.exports = function(sequelize, DataTypes) {
  var Bid = sequelize.define("Bid", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          unique: true
      },
      value: {
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      },
      authorId: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      auctionId: {
          type:Sequelize.INTEGER,
          allowNull: false
      },
      deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
      },
  }, {
    classMethods: {
      associate: function(models) {
        Bid.belongsTo(models.User, {
            foreignKey: "authorId"
        });
        Bid.belongsTo(models.Auction, {
          foreignKey: "auctionId"
        });
      }
    },
    instanceMethods: {

    },
    hooks: {
        beforeCreate: [checkIfAuctionLasts, checkIfGreatest],
        beforeUpdate: [checkIfAuctionLasts, checkIfGreatest],
    }
  });

  function checkIfGreatest(bid, options) {
      return Bid.findAll({
          where: {
              auctionId: bid.auctionId
          },
          order: "value DESC"
      }).then(function(rows) {
          if(rows.length && rows[0].value >= bid.value) {
              return Sequelize.Promise.reject({message: "You have to post bid value greater than current top one."});
          }
      }).catch(Sequelize.Promise.reject);
  }

  function checkIfAuctionLasts(bid, options) {
      return sequelize.models.Auction.findById(bid.auctionId, {}).then(function(auction) {
          var finishedAuctionNotif = "Cannot make bid to auction - it has already finished";
          if(auction.finished) {
              return Sequelize.Promise.reject({message: finishedAuctionNotif});
          } else if(auction.finishes <= Date.now()) {
              auction.finished = true;
              return auction.save().then(function(savedAuction) {
                  return Sequelize.Promise.reject({message: finishedAuctionNotif});
              })
          }
      }).catch(Sequelize.Promise.reject)
  }

  return Bid;
};
