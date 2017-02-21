"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define("Category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [2,40]
            }
        }
    }, {
      classMethods: {
          associate: function(models) {
              Category.belongsToMany(models.Auction, {through: models.AuctionCategory})
          }
      }
    });
    return Category;
};

// var Category = db.define("Category", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey:true,
//     autoIncrement:true,
//     unique: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     validate: {
//       len: [2,40]
//     }
//   }
// });
//
// module.exports = Category;
