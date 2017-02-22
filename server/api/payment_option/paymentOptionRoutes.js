var router = require("express").Router({mergeParams: true});
var ctrl = require("./paymentOptionController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.route("/")
    .get(ctrl.getPossibleChoices)
    .post(checkUser, ctrl.createChoice);

module.exports = router;

