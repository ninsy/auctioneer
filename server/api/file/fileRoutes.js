var router = require("express").Router();
var ctrl = require("./fileController");
var auth = require("../../auth/auth");
var multer = require("multer");

var checkUser = [auth.decodeToken(), auth.getFreshUser()];
var mutlipart = [ multer({storage: multer.memoryStorage()}).single('file') ];

router.post("/", [...checkUser, ...mutlipart] ,ctrl.uploadFile);

module.exports = router;
