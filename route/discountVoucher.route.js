const express = require("express");
const router = express.Router();
const cors = require("cors");
const discountVoucherController = require("../controller/discountVoucher.controller");

router.get("/", discountVoucherController.getAllDiscountVouchers);
router.get("/:id", discountVoucherController.getDiscountVoucherById);
router.post("/", discountVoucherController.createDiscountVoucher);
router.put("/:id", discountVoucherController.editDiscountVoucher);
router.delete("/:id", discountVoucherController.deleteDiscountVoucher);

module.exports = router;
