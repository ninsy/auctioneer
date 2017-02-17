"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var AuctionPayment = sequelize.define("AuctionPayment", {
        auctionId: Sequelize.INTEGER,
        paymentId: Sequelize.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                AuctionPayment.belongsTo(models.Auction, {
                    foreignKey: "auctionId"
                });
                AuctionPayment.belongsTo(models.Payment, {
                    foreignKey: "paymentId"
                })
            }
        }
    });

    return AuctionPayment;
};


// var AuctionPayment = db.define("AuctionPayment", {
//   // payment_id: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: Payment,
//   //     key: "id"
//   //   }
//   // },
//   // auction_id: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: Auction,
//   //     key: "id"
//   //   }
//   // },
//   booked: {
//     type: Sequelize.BOOLEAN
//   }
// });
//
// Auction.hasOne(AuctionPayment, {
//    foreignKey: 'auction_id'
// });
// Payment.hasOne(AuctionPayment, {
//    foreignKey: 'payment_id'
// });
//
//
// module.exports = AuctionPayment;
