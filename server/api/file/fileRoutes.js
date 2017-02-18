var router = require("express").Router();
var ctrl = require("./fileController");
var auth = require("../../auth/auth");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.post("/", checkUser ,ctrl.uploadFile);

module.exports = router;
