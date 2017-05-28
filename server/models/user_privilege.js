"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserPrivilege = sequelize.define("UserPrivilege", {
        privilegeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },{
        classMethods: {
            associate: function(models) {
                UserChosenDelivery.belongsTo(models.Privilege, {
                    foreignKey: "privilegeId"
                });
                UserChosenDelivery.belongsTo(models.User, {
                    foreignKey: "userId"
                });
            },

        },
    });
    return UserPrivilege;
};

