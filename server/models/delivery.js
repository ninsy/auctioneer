"use strict";

var Sequelize = require("sequelize");


module.exports = function(sequelize, DataTypes) {
    var Delivery = sequelize.define("Delivery", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique: true
        },
        cost: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        sent: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        estimatedDelivery: Sequelize.DATE
}, {
      classMethods: {

      },
      instanceMethods: {

      }
    });

    return Delivery;
};

// var Delivery = db.define("Delivery", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey:true,
//     autoIncrement:true,
//     unique: true
//   },
//   sent: {
//     type: Sequelize.BOOLEAN
//   },
//   cost: {
//     type: Sequelize.FLOAT,
//     allowNull: false
//   },
//   estimatedDelivery: {
//     // TODO: validate delivery time greater than now
//     type: Sequelize.DATE
//   },
//   // chosen_delivery_type: {
//   //   type: Sequelize.INTEGER,
//   //   references: {
//   //     model: DeliveryOption,
//   //     key: "id"
//   //   }
//   // }
// });

// DeliveryOption.hasOne(Delivery, {
//     foreignKey: 'chosen_delivery_type'
// });
//
// module.exports = Delivery;
