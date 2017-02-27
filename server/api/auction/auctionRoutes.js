var router = require("express").Router({mergeParams: true});
var ctrl = require("./auctionController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

// TODO: should always attach that auction obj

router.param("id", ctrl.params);

router.use("/:auctionId/bids", require("../bid/bidRoutes"));
router.use("/:auctionId/delivery", require("../delivery/deliveryRoutes"));
router.use("/:auctionId/payment", require("../payment/paymentRoutes"));

router.get("/:id/boughtChoices", checkUser, ctrl.boughtChoices);
router.get("/:id/buyerChoices", checkUser, ctrl.getBuyerChoices);


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
