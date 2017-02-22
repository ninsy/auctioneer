"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserChosenDelivery = sequelize.define("UserChosenDelivery", {
        auctionId: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models) {
                UserChosenDelivery.hasMany(models.DeliveryOption, {
                    foreignKey: "chosenDeliveryId"
                });
                UserChosenDelivery.belongsTo(models.User, {
                    foreignKey: "authorId"
                });
            },

        },
    });
    return UserChosenDelivery;
};

