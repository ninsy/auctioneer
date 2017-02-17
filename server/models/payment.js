"use strict";

var Sequelize = require("sequelize");

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
        }
    });
};

