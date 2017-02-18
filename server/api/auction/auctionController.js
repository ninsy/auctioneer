var Models = require("../../models/db");
var _ = require("lodash");

exports.params = function(req, res, next, id) {
    Models.Auction.findById(id)
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
    Models.Auction.create(req.body).then(function(newAuction) {
        res.json(newAuction);
    }).catch(next)
};

exports.delete = function(req, res, next) {
    req.auction.destroy().then(function(deletedAuction) {
        res.json(deletedAuction);
    }).catch(next);
};