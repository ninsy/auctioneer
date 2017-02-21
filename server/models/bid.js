"use strict";

var Sequelize = require("sequelize");
var Auction = require("./db").Auction;


module.exports = function(sequelize, DataTypes) {
  var Bid = sequelize.define("Bid", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          unique: true
      },
      value: {
          // TODO: trigger which checks whterher value is greater than / equal current maximum | buyout
          type: Sequelize.INTEGER,
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
      }
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
      debugger;
      Bid.findAll({
          where: {
              auctionId: bid.actionId
          }
      }).then(function(rows) {
         debugger;
         
      });
  }

  function checkIfAuctionLasts(bid, options) {
      Auction.findById(bid.auctionId, {}).then(function(auction) {
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
