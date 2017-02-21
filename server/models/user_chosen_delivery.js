"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var BuyerChosenDelivery = sequelize.define("BuyerChosenDelivery", {
        auctionId: {
            type: Sequelize.BOOLEAN,
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
                BuyerChosenDelivery.belongsTo(models.DeliveryOption, {
                    foreignKey: "chosenDelivery"
                });
                BuyerChosenDelivery.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
            },

        },
    });
    return BuyerChosenDelivery;
};

