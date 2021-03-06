"use strict";

var bcrypt = require("bcryptjs");
var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
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
            allowNull: false,
            unique: true
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
    }, {
        hooks: {
            beforeCreate: function(user, options) {
                user.password = user.encryptPassword(user.password);
            },
            beforeUpdate: function (user, options) {
                if(user.changed("email")) {
                    return Sequelize.Promise.reject({status: 400, message: `User email is an immutable property`});
                }
                if(user.changed("password")) {
                    user.password = user.encryptPassword(user.password);
                }
            }
        },
        classMethods: {
            // associate: function(models) {
            //     User.hasMany(models.UserChosenDelivery);
            // }
        }
    });

    User.Instance.prototype.toJSON = function () {
        delete this.dataValues.password;
        return this.dataValues;
    };

    User.Instance.prototype.authenticate = function(plainTextPass) {
        console.log(`ctx: ${this}, mail" ${this.dataValues.email}`);
        console.log(`Plaintxt: ${plainTextPass}, hash: ${this.password}, fn: ${bcrypt.compareSync(plainTextPass, this.dataValues.password)}`);
        return bcrypt.compareSync(plainTextPass, this.password);
    };

    User.Instance.prototype.encryptPassword = function(plainTextPass) {
        if(!plainTextPass) {
            return "";
        } else {
            var salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(plainTextPass, salt);
        }
    };

    return User;
};