var router = require("express").Router({mergeParams: true});
var ctrl = require("./auctionController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];


router.use("/:auctionId/bids", require("../bid/bidRoutes"));

router.param("id", ctrl.params);

router.route("/")
  .get(ctrl.get)
  .post(checkUser, ctrl.post);

router.route("/:id")
  .get(ctrl.getOne)
  .put(checkUser, ctrl.put)
  .delete(checkUser, ctrl.delete);

module.exports = router;
