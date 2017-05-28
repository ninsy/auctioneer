var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var Address = sequelize.define("Address", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,30]
            }
        },
        houseNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1,10]
            }
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,30]
            }
        },
        postalCode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,10]
            }
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,30]
            }
        }
    }, {
        classMethods: {

        },
        instanceMethods: {

        }
    });

    return UserAddress;
};


