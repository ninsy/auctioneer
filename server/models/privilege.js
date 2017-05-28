"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var Privilege = sequelize.define("Privilege", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        state: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        }
    },{
        classMethods: {
            associate: function(models) {

            },

        },
    });
    return Privilege;
};

