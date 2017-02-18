var User = require("../../models/db").User;
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken;

exports.params = function(req, res, next, id) {
    User.findById(id, {
        attributes: {
            exclude: ['password']
        }
    })
        .then(function(user) {
            if (!user) {
                next({status: 404, message: `User with id [${id}] doesn't exist`});
            } else {
                req.user = user;
                next();
            }
        }).catch(next);
};

exports.get = function(req, res, next) {
    User.findAndCountAll({
        attributes: {
            exclude: ['password']
        }
    })

        .then(function(users){
            res.json(users.rows.map(function(user){
                return user.toJSON();
            }));
        }).catch(next);
};

exports.getOne = function(req, res, next) {
    var user = req.user.toJSON();
    res.json(user);
};

exports.auctions = function(req, res, next) {

};

exports.put = function(req, res, next) {
    var user = req.user;
    var update = req.body;

    _.merge(user, update);

    user.save().then(function(saved) {
        res.json(saved.toJSON());
    }).catch(next);
};

exports.post = function(req, res, next) {
    User.create(req.body).then(function(user) {
        var token = signToken(user._id);
        res.json({token: token});
    }).catch(next);
};

exports.delete = function(req, res, next) {
    req.user.destroy().then(function(removed) {
        res.json(removed.toJSON());
    }).catch(next);
};

exports.me = function(req, res) {
    res.json(req.user.toJSON());
};