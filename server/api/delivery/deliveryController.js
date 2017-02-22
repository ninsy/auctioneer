var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    Models.Delivery.findById(id)
        .then(function(delivery) {
            if (!category) {
                next({status: 404, message: `Delivery with id [${id}] doesn't exist`});
            } else {
                req.delivery= delivery;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Delivery.findAndCountAll().then(function(delivieries) {
        res.json(delivieries.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.category);
};

exports.put = function(req, res, next) {
    var delivery = req.delivery;
    var update = req.body;

    _.merge(delivery, update);

    delivery.save().then(function(savedDelivery) {
        res.json(savedDelivery);
    }).catch(next);

};

exports.post = function(req, res, next) {

    Promise.all([
        Models.Auction.findById(req.params.auctionId),
        Models.Delivery.create(req.body)
    ]).then(function (values) {

        var auction = values[0],
            delivery = values[1];

        auction.deliveryId = payment.id;
        auction.save().then(function (saved) {
            res.json({
                delivery: delivery,
                auction: saved
            })
        })

    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.delivery.destroy().then(function(deletedDelivery) {
        res.json(deletedDelivery);
    }).catch(next);

};

exports.create = function(delivery, auctionId) {
    return Promise.all([
        Models.Auction.findById(auctionId),
        Models.Delivery.create(delivery)
    ]).then(function (values) {

        var auction = values[0],
            delivery = values[1];

        auction.deliveryId = payment.id;
        return auction.save().then(function (saved) {
            return {
                delivery: delivery,
                auction: saved
            }
        })

    }).catch(function(err) {
        return new Error(err);
    });
};