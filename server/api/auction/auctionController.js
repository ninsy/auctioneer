var Models = require("../../models/db");
var _ = require("lodash");
var belongsHelper = require("../../util/belongsToManyHelper");

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

    var searchObj = {};

    if(req.query) {

        searchObj.where = {
            finished: {
                $ne: true
            }
        };
        searchObj.include =  [
            // {
            //     // TODO: add marked deliveries + detailed author info + payment options
            // }
        ];
        searchObj.order = [];

        if(req.query.nameSearch) {
            searchObj.where.name = {
                $like: `%${req.query.nameSearch}%`
            };
        }
        if(req.query.categorySearch) {
            searchObj.include.push({
                model: Models.Category,
                where: {
                    id: {
                        $in: req.query.categorySearch.split(",")
                    }
                }
            });
        }
        if(req.query.orderBy) {
            // Example: localhost:3000/api/auctions?orderBy=finishes desc,authorId asc&categorySerach=1,2,3
            var sortParams = req.query.orderBy.split(",");
            for(var i = 0; i < sortParams.length; i++) {
                searchObj.order.push(sortParams[i].split(' '))
            }
        }
    }
    Models.Auction.findAndCountAll(searchObj).then(function(auctions) {
        res.json(auctions.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.specificUserBiddingAuction = function(req, res, next) {
    Models.Auction.findById(id, {
        include: [
            {
                model: Models.User,
                as: "author"
            },
            {
                model: Models.Bid,
                as: "otherBids"
            },
            {
                model: Models.DeliveryOption,
                where: {

                },
                include: [Models.Delivery]
            }
        ]
    }).then(function(auction) {

    }).catch(next);
};

exports.specificUsersAuction = function() {
    Models.Auction.findById(id, {

    }).then(function(auction) {

    }).catch(next);
};

exports.userBiddingAuctions = function(req, res, next) {
    Models.Auction.findAndCountAll({
        include: [
            {
                model: Models.Bid,
                where: {
                    authorId: req.user.id
                },
                order: "value DESC"
            }
        ]
    }).then(function(auctions) {
        res.json(auctions.rows);
    }).catch(next);
};

exports.usersAuctions = function(req, res, next) {
    Models.Auction.findAndCountAll({
        include: [
            {
                model: Models.Bid,
                order: "value DESC"
            }
        ]
    }).then(function(auctions) {
        res.json(auctions.rows);
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

function promisify(fn,id) {
    return function() {
        return fn(id);
    }
}

exports.post = function(req, res, next) {
    req.body.authorId = req.user.id;

    if(!req.body.hasOwnProperty("deliveryOption") || !req.body.hasOwnProperty("paymentOption") ||
       !req.body.hasOwnProperty("deliveryCost") || !req.body.hasOwnProperty("categoryIds")) {
        res.status(400).json({message: "You need to provide metadata about auction payment, delivery and categories"});
        return;
    }

    Models.Auction.create(req.body).then(function(newAuction) {

        var deliveryObj = {
            cost: req.body.deliveryCost,
            estimatedDelivery: req.body.deliveryDate
        };

        req.body.categoryIds = JSON.parse(req.body.categoryIds);
        var promiseArr = [];
        for(let i = 0; i < req.body.categoryIds.length; i++) {
            promiseArr.push(promisify(newAuction.addCategories), req.body.categoryIds[i]);
        }

        Promise.all(promiseArr).then(function() {

            return Promise.all([
                deliveryCtrl.create(deliveryObj, newAuction.id),
                paymentCtrl.create({}, newAuction.id),
                deliveryOptionCtrl.makeChoice(req.user.id, parseInt(req.body.deliveryOption), newAuction.id),
                paymentOptionCtrl.makeChoice(req.user.id, parseInt(req.body.paymentOption), newAuction.id),
                newAuction.addCategories(req.body.categoryIds)
            ]).then(function(values) {

                newAuction.dataValues.deliveryId = values[0].auction.dataValues.deliveryId;
                newAuction.dataValues.paymentId = values[1].auction.dataValues.paymentId;

                res.json(newAuction);

            }).catch(function(err) {

                next(err);
            });

        });


    }).catch(next)
};

exports.delete = function(req, res, next) {
    req.auction.destroy().then(function(deletedAuction) {
        res.json(deletedAuction);
    }).catch(next);
};
