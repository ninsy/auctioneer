"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var BuyerChosenPayment = sequelize.define("BuyerChosenPayment", {
        auctionId: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        chosenPayment: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models) {
                BuyerChosenPayment.belongsTo(models.PaymentOption, {
                    foreignKey: "chosenPayment"
                });
                BuyerChosenPayment.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
            }
        },
    });
    return BuyerChosenPayment;
};

