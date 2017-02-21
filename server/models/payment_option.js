"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var PaymentOption = sequelize.define("PaymentOption", {
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
        paymentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models) {
                PaymentOption.belongsTo(models.Payment,{
                    foreignKey: "paymentId"
                });
            }
        },
    });
    return PaymentOption;
};

