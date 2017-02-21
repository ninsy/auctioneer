"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var Payment = sequelize.define("Payment", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        auctionId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        choosenPaymentType: {
            allowNull: false,
            type: Sequelize.INTEGER
        }
    },{
        classMethods: {
            associate: function(models) {
                Payment.belongsTo(models.Auction,{
                    foreignKey: "auctionId"
                });
                Payment.belongsTo(models.PaymentOption, {
                    foreignKey: "choosenPaymentType"
                })
            }
        },
    });
    return Payment;
};

