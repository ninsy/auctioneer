var router = require("express").Router();
var verifyUser = require("./auth").verifyUser;
var ctrl = require("./controller");

router.post("/signin", verifyUser(), ctrl.signin);

module.exports = router;
