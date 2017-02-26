var router = require("express").Router({mergeParams: true});

router.use("/users", require("./user/userRoutes"));
router.use("/categories", require("./category/categoryRoutes"));
router.use("/auctions", require("./auction/auctionRoutes"));
router.use("/paymentOptions", require("./payment_option/paymentOptionRoutes"));
router.use("/deliveryOptions", require("./delivery_option/deliveryOptionRoutes"));
router.use("/files", require("./file/fileRoutes"));

module.exports = router;
