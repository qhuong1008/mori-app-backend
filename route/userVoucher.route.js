const express = require("express");
const router = express.Router();
const cors = require("cors");
const userVoucherController = require("../controller/userVoucher.controller");

router.post("/", cors(), userVoucherController.createUserVoucher);
router.get("/:id", cors(), userVoucherController.getAllUserVouchersById);
router.put("/:id", cors(), userVoucherController.updateUserVoucherUsedStatus);

module.exports = router;
