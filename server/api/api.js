var router = require("express").Router();

router.use("/users", require("./user/userRoutes"));
router.use("/bids", require("./bid/bidRoutes"));
router.use("/categories", require("./category/categoryRoutes"));
router.use("/deliveries", require("./delivery/deliveryRoutes"));
router.use("/payments", require("./payment/paymentRoutes"));
router.use("/auctions", require("./auction/auctionRoutes"));
router.use("/deliveryOptions", require("./delivery_option/deliveryOptionRoutes"));
router.use("/files", require("./file/fileRoutes"));

module.exports = router;
