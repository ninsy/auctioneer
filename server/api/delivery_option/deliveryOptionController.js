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

function promisify(fn,entity) {
    return function() {
        return fn(entity);
    }
}


exports.makeChoice = function(userId, optionIdsArray, auctionId) {

    optionIdsArray = JSON.parse(optionIdsArray);

    return Models.DeliveryOption.findAndCountAll(
        {
            where: {
                id: {
                    $in: optionIdsArray
                }
            }
        }).then(function(options) {

        // TODO: handle mismatch between actual data and optionIdsArray

        var choices = [];
        for(let i = 0; i < options.rows.length; i++) {
            choices.push({
                authorId: userId,
                auctionId: auctionId,
                chosenDelivery: options.rows[i].id
            });
        }

        return Models.UserChosenDelivery.bulkCreate(choices)
            .then(function() {
                return {
                    chosenDeliveries: options.rows
                }
            })

    });
};
