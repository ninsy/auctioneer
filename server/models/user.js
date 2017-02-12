"use strict";

var bcrypt = require("bcryptjs");
var Sequelize = require("sequelize");
var db = require("./db");

var User = db.define("User", {
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
  passHash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bank_account: {
    type: Sequelize.String,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 30
    }
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 30
    }
  },
  tel: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      max: 20
    }
  },
  street: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 30
    }
  },
  houseNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 10
    }
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 30
    }
  },
  postalCode: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 10
    }
  }
}, {
  getterMethods: {
    toJSON: function() {
      var obj = this.toObject();
      delete obj.passHash;
      return obj;
    },
    authenticate: function(plainTextPass) {
      return bcrypt.compareSync(plainTextPass, this.passHash);
    },
    encryptPassword: function(plainTextPass) {
        if(!plainTextPass) {
          return "";
        } else {
          var salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(plainTextPass, salt);
        }
    }
  }
});

// TODO: rename passHash to simple 'password'

User.beforeUpdate(function(user, options) {
  user.passHash = user.encryptPassword(user.passHash)
})
