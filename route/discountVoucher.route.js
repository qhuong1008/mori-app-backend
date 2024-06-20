const express = require("express");
const router = express.Router();
const cors = require("cors");
const discountVoucherController = require("../controller/discountVoucher.controller");

router.get("/", cors(), discountVoucherController.getAllDiscountVouchers);
router.get("/:id", cors(), discountVoucherController.getDiscountVoucherById);
router.post("/", cors(), discountVoucherController.createDiscountVoucher);

module.exports = router;
