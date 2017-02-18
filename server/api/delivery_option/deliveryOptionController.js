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
    Models.DeliveryOption.findAndCountAll().then(res.json).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.deliveryOption);
};

exports.put = function(req, res, next) {
    var deliveryOption = req.deliveryOption;
    var update = req.body;

    _.merge(deliveryOption, update);

    deliveryOption.save().then(res.json).catch(next);
};

exports.post = function(req, res, next) {
    Models.DeliveryOption.create(req.body).then(res.json).catch(next);
};

exports.delete = function(req, res, next) {
    req.deliveryOption.destroy().then(res.json).catch(next);
};
