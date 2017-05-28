"use strict";

var Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {

    var AuctionCategory = sequelize.define("AuctionCategory", {
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        auctionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        classMethods: {
            associate: function (models) {
                AuctionCategory.belongsTo(models.Category, {
                    foreignKey: "categoryId"
                });
                AuctionCategory.belongsTo(models.Auction, {
                    foreignKey: "auctionId"
                });
            },
        },
    });
    return AuctionCategory;
};


