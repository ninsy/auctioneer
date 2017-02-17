"use strict";

var bcrypt = require("bcryptjs");
var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bankAccount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,30]
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,30]
            }
        },
        tel: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [2,10],
            }
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
        }
    }, {
        hooks: {
            beforeCreate: function(user, options) {
                user.password = user.encryptPassword(user.password);
            }
        },
        instanceMethods: {
            toJSON: function() {
                return this.dataValues;
            },
            authenticate: function(plainTextPass) {
                return bcrypt.compareSync(plainTextPass, this.password);
            },
            encryptPassword: function(plainTextPass) {
                if(!plainTextPass) {
                    return "";
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    return bcrypt.hashSync(plainTextPass, salt);
                }
            }
        },
        classMethods: {

        }
    });
};



// Bid.BelongsTo(User, {
//     foreignKey: 'author_id'
// });



// TODO: rename passHash to simple 'password'


