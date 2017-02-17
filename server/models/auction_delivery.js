"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var AuctionDelivery = sequelize.define("AuctionDelivery", {
        auctionId: Sequelize.INTEGER,
        deliveryId: Sequelize.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                AuctionDelivery.belongsTo(models.Auction, {
                    foreignKey: "auctionId"
                });
                AuctionDelivery.belongsTo(models.Delivery, {
                    foreignKey: "deliveryId"
                })
            }
        }
    });

    return AuctionDelivery;
};


// var AuctionDelivery = db.define("AuctionDelivery", {
//   // delivery_id: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: Delivery,
//   //     key: "id"
//   //   }
//   // },
//   // auction_id: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: Auction,
//   //     key: "id"
//   //   }
//   // }
// });
//
// Auction.hasOne(AuctionDelivery, {
//    foreignKey: 'auction_id'
// });
// Delivery.hasOne(AuctionDelivery, {
//    foreignKey: 'delivery_id'
// });
//
//
// module.exports = AuctionDelivery;
