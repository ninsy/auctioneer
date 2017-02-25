var Models = require("../../models/db");
var _ = require("lodash");

exports.params = function(req, res, next, id) {
    id = parseInt(id)
    Models.Bid.findById(id, {
        where: {
            auctionId: parseInt(req.params.auctionId)
        }
    }).then(function(bid) {
        if (!bid) {
            next({status: 404, message: `Bid with id [${id}] doesn't exist`});
        } else {
            req.bid = bid;
            next();
        }
    }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Bid.findAndCountAll({
        where: {
            auctionId: parseInt(req.params.auctionId)
        }
    }).then(function(bids) {
        res.json(bids.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.createBid = function(req, res, next) {
    req.body.auctionId = req.params.auctionId;
    req.body.authorId = req.user.id;
    Models.Bid.create(req.body).then(function(newBid) {
        res.json(newBid);
    }).catch(next)
};

exports.intialBid = function(authorId, startPrice, auctionId) {
    return Models.Bid.create({value: startPrice, authorId, auctionId});
};

exports.updateBid = function(req, res, next) {
    var bid = req.bid;
    var update = req.bid;

    _.merge(bid, update);

    bid.save().then(function(saved) {
        res.json(saved.toJSON());
    }).catch(next);

};

exports.delete = function(req, res, next) {
    req.bid.destroy().then(function(deletedBid) {
        res.json(deletedBid);
    }).catch(next);
};
