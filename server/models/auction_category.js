"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
   var AuctionCategory = sequelize.define("AuctionCategory", {});

   return AuctionCategory;
};

// var AuctionCategory = db.define("AuctionCategory", {
//   // category_id: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: Category,
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


//
// module.exports = AuctionCategory;
