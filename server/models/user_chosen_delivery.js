"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserChosenDelivery = sequelize.define("UserChosenDelivery", {
        auctionId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        chosenDelivery: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },{
        classMethods: {
            associate: function(models) {
                UserChosenDelivery.belongsTo(models.DeliveryOption, {
                    foreignKey: "chosenDelivery"
                });
                UserChosenDelivery.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
                UserChosenDelivery.belongsTo(models.Auction, {
                    foreignKey: "auctionId"
                });
            },

        },
    });
    return UserChosenDelivery;
};

    