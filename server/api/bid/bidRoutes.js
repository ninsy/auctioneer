var router = require("express").Router();
var ctrl = require("./bidController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param("id", ctrl.params);

router.route("/")
  .get(ctrl.get)
  .post(checkUser, ctrl.createBid);

router.route("/:id")
  .get(ctrl.getOne)
  .put(checkUser, ctrl.updateBid)
  .delete(checkUser, ctrl.delete);

module.exports = router;
