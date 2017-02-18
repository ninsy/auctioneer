var Models = require("../../models/db");
var _ = require("lodash");

exports.params = function(req, res, next, id) {
    Models.Auction.findById(id)
        .then(function(auction) {
            if (!user) {
                next({status: 404, message: `Auction with id [${id}] doesn't exist`});
            } else {
                req.auction = auction;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Auction.findAndCountAll().then(res.json).catch(next);
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
        })
};

exports.put = function(req, res, next) {

};

exports.post = function(req, res, next) {

};

exports.delete = function(req, res, next) {

};
