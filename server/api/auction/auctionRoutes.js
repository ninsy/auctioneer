var router = require("express").Router({mergeParams: true});
var ctrl = require("./auctionController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];


router.use("/:auctionId/bids", require("../bid/bidRoutes"));
router.use("/:auctionId/delivery", require("../delivery/deliveryRoutes"));
router.use("/:auctionId/payment", require("../payment/paymentRoutes"));

router.use("/:auctionId/boughtChoices", ctrl.boughtChoices);

router.param("id", ctrl.params);

router.get("/myBidding", checkUser, ctrl.userBiddingAuctions);
router.get("/myPosted", checkUser, ctrl.usersAuctions);

router.route("/")
  .get(ctrl.get)
  .post(checkUser, ctrl.post);

router.route("/:id")
  .get(ctrl.getOne)
  .put(checkUser, ctrl.put)
  .delete(checkUser, ctrl.delete);

module.exports = router;
