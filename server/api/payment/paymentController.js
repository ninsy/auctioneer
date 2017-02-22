var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    id = parseInt(id)
    Models.Payment.findById(id)
        .then(function(payment) {
            if (!payment) {
                next({status: 404, message: `Payment with id [${id}] doesn't exist`});
            } else {
                req.payment= payment;
                next();
            }
        }).catch(next);

};

exports.get = function(req, res, next) {
    Models.Payment.findAndCountAll().then(function(payments) {
        res.json(payments.rows);
    }).catch(next);
    // TODO: pobrac cale szczegolowe info - mozliwe opcje przesylki, platnosci
};

exports.getOne = function(req, res, next) {
    res.json(req.payment);
};

exports.put = function(req, res, next) {
    var payment = req.payment;
    var update = req.body;

    _.merge(payment, update);

    payment.save().then(function(saved) {
        res.json(saved);
    }).catch(next);

};

exports.post = function(req, res, next) {

    Promise.all([
        Models.Auction.findById(req.params.auctionId),
        Models.Payment.create(req.body)
    ]).then(function(values) {

        var auction = values[0],
            payment = values[1];

        auction.paymentId = payment.id;
        auction.save().then(function(saved) {
            res.json({
                payment: payment,
                auction: saved
            })
        })

    }).catch(next);

};

exports.delete = function(req, res, next) {
    req.payment.destroy().then(function(deletedPayment) {
        res.json(deletedPayment);
    }).catch(next);
};

exports.create = function(payment, auctionId) {
    return Promise.all([
        Models.Auction.findById(auctionId),
        Models.Payment.create(payment)
    ]).then(function(values) {

        var auction = values[0],
            payment = values[1];

        auction.paymentId = payment.id;
        return auction.save().then(function(saved) {
            return {
                payment: payment,
                auction: saved
            }
        })

    }).catch(function(err) {
        return new Error(err);
    });

};