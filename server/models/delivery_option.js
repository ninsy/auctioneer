"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("DeliveryOption", {
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
        }
    });
};


// var DeliveryOption = db.define("DeliveryOption", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey:true,
//     autoIncrement:true,
//     unique: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     unique: true,
//     validate: {
//       len: [2,20]
//     }
//   }
// });
//
// module.exports = DeliveryOption;
