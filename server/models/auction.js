"use strict";

var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Auction = sequelize.define("Auction", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          unique: true
      },
      started: {
          type: Sequelize.DATE,
          allowNull: false
      },
      finishes: {
          // TODO: validate that it is greater than started
          type: Sequelize.DATE,
          allowNull: false
      },
      imageUrl: {
          type: Sequelize.STRING,
          validate: {
              isUrl: true
          }
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
              len: [2,30]
          }
      },
      description: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              len: [2,300]
          }
      },
      finished: Sequelize.BOOLEAN,
      author_id: Sequelize.INTEGER
  },{
      classMethods: {
        associate: function(models) {
          Auction.belongsTo(models.User, {
            foreignKey: "author_id"
          })
        }
      }
  });

  return Auction;

};

