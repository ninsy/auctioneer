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
        beforeCreate: checkIfGreatest,
        beforeUpdate: checkIfGreatest,
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
          debugger;
          var finishedAuctionNotif = "Cannot make bid to auction - it has already finished";
          if(auction.finished) {
              return Sequelize.promise.reject({message: finishedAuctionNotif});
          } else if(auction.finishes <= Date.now()) {
              auction.finished = true;
              return auction.save().then(function(savedAuction) {
                  return Sequelize.promise.reject({message: finishedAuctionNotif});
              })
          }
      }).catch(Sequelize.promise.reject)
  }

  return Bid;
};

// var Bid = db.define("Bid", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey:true,
//     autoIncrement:true,
//     unique: true
//   },
  // auction_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: Auction,
  //     key: "id"
  //   }
  // },
  // author_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: User,
  //     key: "id"
  //   }
  // },
//   value: {
//     // TODO: trigger which checks whterher value is greater than / equal current maximum | buyout
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   created_at: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.NOW
//   }
// });
//
// Auction.hasMany(Bid);

// Auction.hasOne(Bid, {
//    foreignKey: 'auction_id'
// });



// module.exports = Bid;
