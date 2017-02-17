var signToken = require("./auth").signToken;

exports.signin = function(req, res, next) {
  var token = signToken(req.user.id);
  res.json({token: token});
};
