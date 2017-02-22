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
            unique: true,
            validate: {
                len: [2,20]
            }
        }
    },{
        classMethods: {
            // associate: function(models) {
            //     PaymentOption.belongsTo(models.Payment,{
            //         foreignKey: "paymentId"
            //     });
            // }
        },
    });
    return PaymentOption;
};

