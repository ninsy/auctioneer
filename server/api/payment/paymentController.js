var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
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
    Models.Payment.create(req.body).then(function(newPayment) {
        res.json(newPayment);
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.payment.destroy().then(function(deletedPayment) {
        res.json(deletedPayment);
    }).catch(next);

};
