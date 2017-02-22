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
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Payment;
};

