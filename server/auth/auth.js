var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
// var User = require('../api/user/userModel');

exports.decodeToken = function() {
  return function(req, res, next) {
    if(req.query && req.query.hasOwnProperty("access_token")) {
      req.headers.authorization = `Bearer: ${req.query.access_token}`;
    }
    checkToken(req, res, next);
  }
}

exports.getFreshUser = function() {
  return function(req, res, next) {
    
  }
}
