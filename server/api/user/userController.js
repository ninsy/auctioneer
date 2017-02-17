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
                next(new Error('No user with that id'));
            } else {
                req.user = user;
                next();
            }
        }, function(err) {
            next(err);
        });
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
        }, function(err){
            next(err);
        });
};

exports.getOne = function(req, res, next) {
    var user = req.user.toJSON();
    res.json(user.toJSON());
};

exports.put = function(req, res, next) {
    var user = req.user;
    var update = req.body;

    _.merge(user, update);

    user.save().then(function(saved) {
        res.json(saved.toJSON());
    }).catch(function(err) {
        debugger;
        next();
    });
};

exports.post = function(req, res, next) {

    // TODO: check unique / validation errors
    console.log(req.body);
    User.create(req.body).then(function(user) {
        var token = signToken(user._id);
        res.json({token: token});
    }).catch(function(err) {
        debugger;
        next();
    });
};

exports.delete = function(req, res, next) {
    req.user.destroy().then(function(removed) {
        res.json(removed.toJSON());
    }).catch(next);
};

exports.me = function(req, res) {
    res.json(req.user.toJSON());
};