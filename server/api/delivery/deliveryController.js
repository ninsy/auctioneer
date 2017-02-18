var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    Models.Delivery.findById(id)
        .then(function(delivery) {
            if (!category) {
                next({status: 404, message: `Delivery with id [${id}] doesn't exist`});
            } else {
                req.delivery= delivery;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Delivery.findAndCountAll().then(function(delivieries) {
        res.json(delivieries.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.category);
};

exports.put = function(req, res, next) {
    var delivery = req.delivery;
    var update = req.body;

    _.merge(delivery, update);

    delivery.save().then(function(savedDelivery) {
        res.json(savedDelivery);
    }).catch(next);

};

exports.post = function(req, res, next) {
    Models.Delivery.create(req.body).then(function(newDelivery) {
        res.json(newDelivery);
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.delivery.destroy().then(function(deletedDelivery) {
        res.json(deletedDelivery);
    }).catch(next);

};
