"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserChosenPayment = sequelize.define("UserChosenPayment", {
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
                UserChosenPayment.belongsTo(models.PaymentOption, {
                    foreignKey: "chosenPayment"
                });
                UserChosenPayment.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
            }
        },
    });
    return UserChosenPayment;
};

