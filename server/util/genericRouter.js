var auth = require("../auth/auth")

module.exports = function(router, ctrl) {

  var checkUser = [auth.decodeToken(), auth.getFreshUser()];

  debugger;

  router.param("id", ctrl.params);

  router.route("/")
    .get(ctrl.get)
    .post(checkUser, ctrl.post)

  router.route("/:id")
    .get(ctrl.getOne)
    .put(checkUser, ctrl.put)
    .delete(checkUser, ctrl.delete)

};
