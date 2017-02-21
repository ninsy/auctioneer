var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var User = require('../models/db').User;

exports.decodeToken = function() {
  return function(req, res, next) {
    if(req.query && req.query.hasOwnProperty("access_token")) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }
    checkToken(req, res, next);
  }
};

exports.getFreshUser = function() {
  return function(req, res, next) {
    console.log(`USER ID: ${req.user.id}`);
    User.findById(req.user.id).then(function(user) {
      if(!user) {
        res.status(401).json({message: "Unauthorized"});
      } else {
        req.user = user;
        next();
      }
    }).catch(function(err) {
      next(err);
    })
  }
};

exports.verifyUser = function() {
  return function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    if(!email || !password) {
      res.status(400).json({message: "You need to provide both email and password"});
      return;
    }

    console.log(`Passed email: ${req.body.email}, val:${email}`);

    User.findAll({where: {email: email}}).then(function(user) {

      console.log(`Fetched user: ${user.dataValues.email}`);

      if(!user.authenticate(password)) {
        res.status(401).json({message: "Wrong password."});
      } else {
        req.user = user;
        next();
      }
    }).catch(function(error) {
      next(err);
    })
  }
};

exports.signToken = function(id) {
  return jwt.sign(
    {id: id},
    config.secrets.jwt,
    {expiresIn: config.expireTime}
  );
};
