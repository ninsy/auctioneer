var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    Models.Bid.findById(id, {}).then(function(bid) {
        if (!user) {
            next({status: 404, message: `Bid with id [${id}] doesn't exist`});
        } else {
            req.bid = bid;
            next();
        }
    }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Bid.findAndCountAll().then(function(bids) {
        res.json(bids.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.createBid = function(req, res, next) {
    Models.Bid.create(req.body).then(function(newBid) {
        res.json(newBid);
    }).catch(next)
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
