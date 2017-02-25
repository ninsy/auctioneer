var Models = require("../../models/db");

exports.getPossibleChoices = function (req, res, next) {
    Models.PaymentOption.findAndCountAll({}).then(function(options) {
        res.json(options.rows);
    }).catch(next);
};

exports.createChoice = function(req, res, next) {
    Models.PaymentOption.create(req.body).then(function (option) {
        res.json(option);
    }).catch(next);
};

exports.makeChoice = function (userId, optionIdArray, auctionId) {

    optionIdArray = JSON.parse(optionIdArray);

    return Models.PaymentOption.findAndCountAll(
        {
            where: {
                id: {
                    $in: optionIdArray
                }
            }
        }).then(function(options) {

        // TODO: handle mismatch between actual data and optionIdsArray

        var choices = [];
        for(let i = 0; i < options.rows.length; i++) {
            choices.push({
                authorId: userId,
                auctionId: auctionId,
                chosenPayment: options.rows[i].id
            });
        }

        return Models.UserChosenPayment.bulkCreate(choices)
            .then(function() {
                return {
                    chosenPayments: options.rows
                }
            });
    });
};



