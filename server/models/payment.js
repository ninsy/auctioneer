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
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                min: 0,
                max: 255,
            }
        },
        value: {
            type: Sequelize.DECIMAL,
            validate: {
                len: [0,225],
            }
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Payment;
};

