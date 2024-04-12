const CartItem = require("../model/cartItem.model");

exports.getSelectedItems = async (req, res) => {
  try {
    const selectedItems = req.body.selectedItems;
    const itemsCheckout = await CartItem.find({ _id: { $in: selectedItems }}).populate(
      "book_id",
      "name image price"
    );
    res.json({ itemsCheckout: itemsCheckout, statusCode: 200 });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

exports.addBooktoCart = async (req, res) => {
  const { account_id, book_id, quantity } = req.body;
  try {
    const existingCartItem = await CartItem.findOne({ account_id, book_id });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      res.json({ message: "Quantity updated in cart!" });
    } else {
      const cartItem = new CartItem({ account_id, book_id, quantity });
      await cartItem.save();
      res.json({ message: "CartItem added successfully!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.cartOfCustomer = async (req, res) => {
  const account_id = req.params.id;
  try {
    const cartItems = await CartItem.find({ account_id }).populate(
      "book_id",
      "name image price"
    );
    res.json({ cartItems: cartItems, statusCode: 200 });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  console.log(req.body);

  try {
    // Tìm kiếm sản phẩm trong giỏ hàng bằng cartItemId
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: "CartItem not found" });
    }

    // Cập nhật số lượng sản phẩm
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "CartItem quantity updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteBookFromCart = async (req, res) => {
  const cartItemId = req.params.id;
  try {
    // Tìm sản phẩm trong giỏ hàng và xóa nó
    await CartItem.findByIdAndDelete(cartItemId);
    res.json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
