const express = require("express");
const router = express.Router();
var cors = require("cors");

const cartItemController = require("../controller/cartItem.controller");

router.post("/add-cartitem", cors(), cartItemController.addBooktoCart);
router.get("/get-cartitem/:id", cors(), cartItemController.cartOfCustomer);
router.patch(
  "/update-quantity",
  cors(),
  cartItemController.updateCartItemQuantity
);
router.delete(
  "/deletebook/:id",
  cors(),
  cartItemController.deleteBookFromCart
);

module.exports = router;
