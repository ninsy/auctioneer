var Models = require("../../models/db");

exports.params = function(req, res, next, id) {
    Models.Category.findById(id)
        .then(function(category) {
            if (!category) {
                next({status: 404, message: `Category with id [${id}] doesn't exist`});
            } else {
                req.category= category;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    Models.Category.findAndCountAll().then(function(categories) {
        res.json(categories.rows);
    }).catch(next);
};

exports.getOne = function(req, res, next) {
    res.json(req.category);
};

exports.put = function(req, res, next) {
    var category = req.category;
    var update = req.body;

    _.merge(category, update);

    category.save().then(function(savedCategory) {
        res.json(savedCategory);
    }).catch(next);
};

exports.post = function(req, res, next) {
    Models.Category.create(req.body).then(function(newCategory) {
        res.json(newCategory);
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.category.destroy().then(function(deletedCategories) {
        res.json(deletedCategories);
    }).catch(next);
};
