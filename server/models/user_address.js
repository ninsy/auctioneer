var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var UserAddress = sequelize.define("UserAddress", {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        addressId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        classMethods: {
            associate: function(models) {
                UserAddress.belongsTo(models.User, {
                    foreignKey: 'userId',
                });
                UserAddress.belongsTo(models.Address, {
                    foreignKey: 'addressId',
                });
            }
        },
        instanceMethods: {

        }
    });

    return UserAddress;
};
