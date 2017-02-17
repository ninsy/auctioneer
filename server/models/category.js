"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [2,40]
            }
        }
    }, {
      classMethods: {

      }
    });
};

// var Category = db.define("Category", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey:true,
//     autoIncrement:true,
//     unique: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     validate: {
//       len: [2,40]
//     }
//   }
// });
//
// module.exports = Category;
