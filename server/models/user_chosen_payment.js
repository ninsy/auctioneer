"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserChosenPayment = sequelize.define("UserChosenPayment", {
        auctionId: {
            type: Sequelize.INTEGER,
        },
        authorId: {
            type: Sequelize.INTEGER
        },
        chosenPayment: {
            type: Sequelize.INTEGER
        }
    },{
        classMethods: {
            associate: function(models) {
                UserChosenPayment.belongsTo(models.PaymentOption, {
                    foreignKey: "chosenPayment"
                });
                UserChosenPayment.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
                UserChosenPayment.belongsTo(models.Auction, {
                    foreignKey: "auctionId"
                });

            }
        },
    });
    return UserChosenPayment;
};

