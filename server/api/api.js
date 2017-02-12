var router = require("express").Router();

router.use("/users", require("./user/userRoutes"));
router.use("/bids", require("./bid/bidRoutes"));
router.use("/categories", require("./category/categoryRoutes"));
router.use("/deliveries", require("./delivery/deliveryRoutes"));
router.use("/payments", require("./payment/paymentRoutes"));
router.use("/auctions", require("./auction/auctionRoutes"));

module.exports = router;
