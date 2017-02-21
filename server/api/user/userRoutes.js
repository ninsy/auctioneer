var router = require("express").Router();
var ctrl = require("./userController");
var routes = require("../../util/genericRouter");
var auth = require("../../auth/auth");
var checkUser = [auth.decodeToken(), auth.getFreshUser() ];

router.param("id", ctrl.params);

router.route("/")
  .get(ctrl.get)
  .post(ctrl.post);

router.route("/:id")
  .get(ctrl.getOne)
  .put(checkUser, ctrl.put)
  .delete(checkUser, ctrl.delete);

router.get("/me", checkUser, ctrl.me);
router.get("/:id/biddingAuctions", checkUser, ctrl.biddingAuctions);
router.get("/:id/postedAuctions", checkUser, ctrl.postedAuctions);

module.exports = router;
