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
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        estimatedDelivery: Sequelize.DATE,
        chosenUserAddressId: Sequelize.INTEGER,
}, {
      classMethods: {
          associate: function(models) {
              Delivery.belongsTo(models.UserAddress, {
                 foreignKey: 'chosenUserAddressId',
              });
          }
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
