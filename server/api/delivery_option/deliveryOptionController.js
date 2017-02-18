var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    Models.DeliveryOption.findById(id)
        .then(function(deliveryOption) {
            if (!deliveryOption) {
                next({status: 404, message: `Delivery option with id [${id}] doesn't exist`});
            } else {
                req.deliveryOption= deliveryOption;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.DeliveryOption.findAndCountAll().then(function(options) {
        res.json(options.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.deliveryOption);
};

exports.put = function(req, res, next) {
    var deliveryOption = req.deliveryOption;
    var update = req.body;

    _.merge(deliveryOption, update);

    deliveryOption.save().then(function(saved) {
        res.json(saved);
    }).catch(next);
};

exports.post = function(req, res, next) {
    Models.DeliveryOption.create(req.body).then(function(newOption) {
        res.json(newOption);
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.deliveryOption.destroy().then(function(deletedOption) {
        res.json(deletedOption);
    }).catch(next);
};
