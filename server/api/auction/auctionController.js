var Models = require("../../models/db");
var _ = require("lodash");

var paymentCtrl =  require("../payment/paymentController"),
    paymentOptionCtrl = require("../payment_option/paymentOptionController"),
    deliveryCtrl = require("../delivery/deliveryController"),
    deliveryOptionCtrl = require("../delivery_option/deliveryOptionController");

exports.params = function(req, res, next, id) {
    id = parseInt(id);
    Models.Auction.findById(id, {
        include: [
            {
                model: Models.Bid,
                as: "bids",
                where: {
                    auctionId: id,
                },
                required: false,
                order: "value DESC"
            }
        ]
    })
        .then(function(auction) {
            if (!auction) {
                next({status: 404, message: `Auction with id [${id}] doesn't exist`});
            } else {
                req.auction = auction;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Auction.findAndCountAll({}).then(function(auctions) {
        res.json(auctions.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.bids = function(req, res, next) {
    Models.Bids.findAll({
        where: {
            auctionId: req.auction.id
        }
    })
        .then(function(bids) {
            res.json(bids.rows);
        }).catch(next);
};

exports.put = function(req, res, next) {
    var auction = req.auction;
    var update = req.body;

    _.merge(auction, update);

    auction.save().then(function(saved) {
        res.json(saved);
    }).catch(next);
};

exports.post = function(req, res, next) {
    req.body.authorId = req.user.id;
    Models.Auction.create(req.body).then(function(newAuction) {

        var deliveryObj = {
            cost: req.body.deliveryCost,
            estimatedDelivery: req.body.deliveryDate
        };

        return Promise.all([
            deliveryCtrl.create(deliveryObj, newAuction.id),
            paymentCtrl.create({}, newAuction.id),
            deliveryOptionCtrl.makeChoice(req.user.id, parseInt(req.body.deliveryOption), newAuction.id),
            paymentOptionCtrl.makeChoice(req.user.id, parseInt(req.body.paymentOption), newAuction.id)
        ]).then(function(values) {

            newAuction.dataValues.deliveryId = values[0].auction.dataValues.deliveryId;
            newAuction.dataValues.paymentId = values[1].auction.dataValues.paymentId;

            res.json(newAuction);

        }).catch(function(err) {

            next(err);
        });

    }).catch(next)
};

exports.delete = function(req, res, next) {
    req.auction.destroy().then(function(deletedAuction) {
        res.json(deletedAuction);
    }).catch(next);
};
