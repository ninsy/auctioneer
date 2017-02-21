"use strict";

var Sequelize = require("sequelize");
var models = require("./db");

module.exports = function(sequelize, DataTypes) {
    var DeliveryOption = sequelize.define("DeliveryOption", {
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
        },
        deliveryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models) {
                DeliveryOption.belongsTo(models.Delivery,{
                    foreignKey: "deliveryId"
                });
            }
        },
    });
    return DeliveryOption;
};

