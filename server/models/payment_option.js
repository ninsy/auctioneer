"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Payment", {
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
        deliveryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models) {
                Payment.belongsTo(models.Auction,{
                    foreignKey: "auctionId"
                });
            }
        },
    });
};

