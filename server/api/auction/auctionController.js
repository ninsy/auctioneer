var Models = require("../../models/db");
var _ = require("lodash");
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
                required: false,
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
                required: false,
                include: [Models.DeliveryOption]
            },
            {
                model: Models.Delivery,
                as: "deliveryData",
                required: false,
                where: {
                    id: Models.sequelize.col("Auction.deliveryId")
                }
            },
            {
                model: Models.Payment,
                as: "paymentData",
                required: false,
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

            if (!auction) {
                next({status: 404, message: `Auction with id [${id}] doesn't exist`});
            } else {
                req.auction = auction;
                auction.dataValues.topBid = auction.Bids[0];
                auction.dataValues.bidCount = auction.Bids.length;
                delete auction.dataValues.Bids;
                if(Date.parse(auction.finishes) <= Date.now()) {
                    auction.finished = true;
                    auction.save();
                }
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {

    var searchObj = {};

    if(req.query) {

        searchObj.where = {
            $and: {
                finished: {
                    $eq: false
                }
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
        // TODO: make ordering by value passed in req.params
        searchObj.order = [[ Models.Bid, 'value', 'DESC']];

        if(req.query.nameSearch) {
            searchObj.where.$and.name = {
                $like: `%${req.query.nameSearch}%`
            }
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

        for(var i = auctions.rows.length-1; i >= 0; i--) {
            auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
            auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
            delete auctions.rows[i].dataValues.Bids;
            if(Date.parse(auctions.rows[i].finishes) <= Date.now()) {
                auctions.rows[i].finished = true;
                auctions.rows[i].save();
                auctions.rows.splice(i,1);
            }
        }
        res.json(auctions.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.auction);
};

exports.userBiddingAuctions = function(req, res, next) {

    // TODO: fucked-up ORM, gonna switch to POSTGRES to handle such trivial cases.
    // sequelize.query(`SELECT * FROM aukcje.Auctions INNER JOIN aukcje.Bids ON aukcje.Bids.auctionId = aukcje.Auctions.id WHERE EXISTS (SELECT id FROM aukcje.Bids WHERE aukcje.Bids.authorId = ${req.user.id}) AND aukcje.Auctions.id NOT IN (SELECT 'aukcje.id' FROM 'aukcje.Auctions' WHERE 'aukcje.authorId' = ${req.user.id}) ORDER BY aukcje.Bids.value DESC`)
    //     .then(function(auctions) {
    //         for(var i = 0; i < auctions.rows.length; i++) {
    //             auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
    //             auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
    //             delete auctions.rows[i].dataValues.Bids;
    //         }
    //         res.json(auctions.rows);
    //     }).catch(next);


    Models.Auction.findAndCountAll({
        include: [
            {
                model: Models.Bid,
                // where: [`EXISTS (SELECT 'id' FROM 'aukcje.Bids' WHERE 'aukcje.Bids.authorId' = ${req.user.id})`]
                // where: {
                //    authorId: {
                //        $contains: req.user.id
                //    }
                // }
            }
        ],
        where: {
            id: { $notIn: [`SELECT 'aukcje.id' FROM 'aukcje.Auctions' WHERE 'aukcje.authorId' = ${req.user.id}`]}
        },
        order: [
            [ Models.Bid, 'value', 'DESC']
        ]
    }).then(function(auctions) {

        auctions.rows = auctions.rows.filter(function(auction) {
            var usrIdx = auction.dataValues.Bids.findIndex(function (bid) {
                return bid.authorId === req.user.id
            });
            return usrIdx !== -1;
        });

        for(var i = 0; i < auctions.rows.length ; i++) {
            auctions.rows[i].dataValues.topBid = auctions.rows[i].Bids[0];
            auctions.rows[i].dataValues.bidCount = auctions.rows[i].Bids.length;
            delete auctions.rows[i].dataValues.Bids;
            if(Date.parse(auctions.rows[i].finishes) <= Date.now()) {
                auctions.rows[i].finished = true;
            }
            auctions.rows[i].finished = auctions.rows[i].finished.toString();
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
            auctions.rows[i].finished = auctions.rows[i].finished.toString();

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

exports.boughtChoices = function(req, res, next) {

    // TODO: that JSON parse should be hanndled differently
    if(!req.auction.finished) {
        return res.status(400).json({message: `Auction ${req.auction.id} has not yet finished.`});
    }
    if(req.auction.Bids[0].authorId !== req.user.id) {
        return res.status(400).json({message: `You have not won auction of id: ${req.auction.id}!`});
    }
    if(Object.prototype.toString.call(JSON.parse(req.body.deliveryOption)) !== "[object Array]" && JSON.parse(req.body.deliveryOption).length > 1) {
        return res.status(400).json({message: `You need to provide single delivery option id in form of one-element array, like: [23]`})
    }
    if(Object.prototype.toString.call(JSON.parse(req.body.paymentOption)) !== "[object Array]" && JSON.parse(req.body.paymentOption).length > 1) {
        return res.status(400).json({message: `You need to provide single payment option id in form of one-element array, like: [79]`})
    }
    Promise.all([
        deliveryOptionCtrl.makeChoice(req.user.id, req.body.deliveryOption, req.auction.id),
        paymentOptionCtrl.makeChoice(req.user.id, req.body.paymentOption, req.auction.id)
    ]).then(function(values) {
        res.status(200).json({message: `Auction ${req.auction.id} has been assigned with delivery option id: ${values[0].chosenDeliveries[0].id} and payment option id: ${values[1].chosenPayments[0].id}.`})
    });
};

// TODO: totally shouldn't be done in such idiotic manner
exports.getBuyerChoices = function(req, res, next) {
    // TODO: should make author verification
    var commonParams = {
        where: {
            $and: {
                auctionId: req.auction.id,
                authorId: req.auction.dataValues.topBid.dataValues.authorId
            }
        }
    };
    Promise.all([
        Models.UserChosenDelivery.findAndCountAll(commonParams),
        Models.UserChosenPayment.findAndCountAll(commonParams)
    ]).then(function(values) {
        res.status(200).json(
            {
                buyerChosenDelivery: values[0].rows[0].chosenDelivery,
                buyerChosenPayment: values[1].rows[0].chosenPayment
            }
        )
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.auction.destroy().then(function(deletedAuction) {
        res.json(deletedAuction);
    }).catch(next);
};

function promisify(fn,id) {
    return function() {
        return fn(id);
    }
}
