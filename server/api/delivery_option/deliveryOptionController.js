var Models = require("../../models/db");

exports.getPossibleChoices = function (req, res, next) {
    Models.DeliveryOption.findAndCountAll({}).then(function(options) {
        res.json(options.rows);
    }).catch(next);
};

exports.createChoice = function (req, res, next) {
    Models.DeliveryOption.create(req.body).then(function(option) {
        res.json(option);
    }).catch(next);
};

exports.makeChoice = function(userId, optionId, auctionId) {
    return Models.DeliveryOption.findAndCountAll().then(function(options) {

        var idx = options.rows.findIndex(function(option) {
            return option.id === optionId;
        });

        if(idx === -1) {
            return Promise.reject({message: `Delivery Option with id ${optionId} doesn't exist`})
        }
        var option = options.rows[idx];

        return Models.UserChosenDelivery.create({
            authorId: userId,
            auctionId: auctionId,
            chosenPayment: option.id
        }).then(function(userOption) {
            return userOption
        });

    });
};
