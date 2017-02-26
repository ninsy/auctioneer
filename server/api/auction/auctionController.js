var Models = require("../../models/db");
var _ = require("lodash");
var belongsHelper = require("../../util/belongsToManyHelper");
var sequelize = require("sequelize");

var paymentCtrl =  require("../payment/paymentController"),
    paymentOptionCtrl = require("../payment_option/paymentOptionController"),
    deliveryCtrl = require("../delivery/deliveryController"),
    deliveryOptionCtrl = require("../delivery_option/deliveryOptionController"),
    bidCtrl = require("../bid/bidController");

exports.params = function(req, res, next, id) {
    id = parseInt(id);
    Models.Auction.findById(id, {
        include: [
            {
                model: Models.Bid,
                where: {
                    auctionId: id,
                },
                required: false
            },
            {
                model: Models.UserChosenPayment,
                as: "possiblePayments",
                where: {
                    $and: {
                        auctionId: id,
                        authorId: Models.sequelize.col("Auction.authorId")
                    }
                },
                include: [Models.PaymentOption]
            },
            {
                model: Models.UserChosenDelivery,
                as: "possibleDeliveries",
                where: {
                    $and: {
                        auctionId: id,
                        authorId: Models.sequelize.col("Auction.authorId")
                    }
                },
                include: [Models.DeliveryOption]
            },
            {
                model: Models.Delivery,
                as: "deliveryData",
                where: {
                    id: Models.sequelize.col("Auction.deliveryId")
                }
            },
            {
                model: Models.Payment,
                as: "paymentData",
                where: {
                    id: Models.sequelize.col("Auction.paymentId")
                }
            }
        ],
        order: [
            [ Models.Bid, 'value', 'DESC']
        ]
    })
        .then(function(auction) {
            auction.dataValues.topBid = auction.Bids[0];
            auction.dataValues.bidCount = auction.Bids.length;
            delete auction.dataValues.Bids;
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
            {
                model: Models.Bid,
                where: {
                    auctionId: Models.sequelize.col("Auction.id")
                },
                required: false
            }
        ];
        searchObj.order = [[ Models.Bid, 'value', 'DESC']];

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

        for(var i = 0; i < auctions.rows.length; i++) {
            auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
            auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
            delete auctions.rows[i].dataValues.Bids;
        }

        res.json(auctions.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.userBiddingAuctions = function(req, res, next) {
    Models.Auction.findAndCountAll({
        include: [
            {
                model: Models.Bid,
                where: {
                   authorId: req.user.id
                }
            }
        ],
        where: {
            id: { $notIn: [`SELECT 'Aukcje.id' FROM 'Aukcje.Auctions' WHERE 'Aukcje.authorId' = ${req.user.id}`]}
        },
        order: [
            [ Models.Bid, 'value', 'DESC']
        ]
    }).then(function(auctions) {
        for(var i = 0; i < auctions.rows.length; i++) {
            auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
            auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
            delete auctions.rows[i].dataValues.Bids;
        }
        res.json(auctions.rows);
    }).catch(next);
};

exports.usersAuctions = function(req, res, next) {
    Models.Auction.findAndCountAll({
        include: [
            {
                model: Models.Bid
            }
        ],
        where: {
            authorId: req.user.id
        },
        order: [
            [ Models.Bid, 'value', 'DESC']
        ]
    }).then(function(auctions) {
        for(var i = 0; i < auctions.rows.length; i++) {
            auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
            auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
            delete auctions.rows[i].dataValues.Bids;
        }
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
        var categoryPromiseArr = [];
        for(let i = 0; i < req.body.categoryIds.length; i++) {
            categoryPromiseArr.push(promisify(newAuction.addCategories), req.body.categoryIds[i]);
        }

        Promise.all(categoryPromiseArr).then(function() {

            return Promise.all([
                deliveryCtrl.create(deliveryObj, newAuction.id),
                paymentCtrl.create({}, newAuction.id),
                deliveryOptionCtrl.makeChoice(req.user.id, req.body.deliveryOption, newAuction.id),
                paymentOptionCtrl.makeChoice(req.user.id, req.body.paymentOption, newAuction.id),
                newAuction.addCategories(req.body.categoryIds),
                bidCtrl.intialBid(req.user.id, req.body.startPrice, newAuction.id)
            ]).then(function(values) {

                newAuction.deliveryId = values[0].auction.dataValues.deliveryId;
                newAuction.paymentId = values[1].auction.dataValues.paymentId;
                newAuction.chosenDeliveryOptions = values[2].chosenDeliveries;
                newAuction.chosenPaymentOptions = values[3].chosenPayments;
                newAuction.categoryIds = values[4][0].map(function(option) {
                    return option.dataValues.CategoryId;
                });

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
