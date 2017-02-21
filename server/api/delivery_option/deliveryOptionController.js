var Models = require("../../models/db");

exports.getPossibleChoices = function (req, res, next) {
    Models.DeliveryOption.findAndCountAll({}).then(function(options) {
        res.json(options.rows);
    }).catch(next);
};

exports.authorChoice = function (req, res, next) {
    Models.Delivery.create().then(function() {

    }).catch(next);
};

exports.buyerChoice = function (req, res, next) {
    Models.BuyerChosenDelivery.create(req.body).then(function(choice) {
        Models.Auction.findById(req.params.auctionId).then(function(auction) {
            auction.buyerDeliveryId = choice.id;
            auction.save().then(function(saved) {
                res.json({
                    message: "Successfully made choice",
                    choice: choice,
                    auction: saved
                });
            });
        });
    }).catch(next);
};
