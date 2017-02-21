var router = require("express").Router();
var ctrl = require("./deliveryOptionController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.get("/", ctrl.getPossibleChoices);
router.post("/:auctionId/author", checkUser, ctrl.authorChoice);
router.post("/:auctionId/buyer",checkUser,ctrl.buyerChoice);

module.exports = router;

