const Order = require("../model/order.model");
const OrderItem = require("../model/orderItem.model")

// Hàm tăng số lượt đọc trong ngày của quyển sách đó
exports.order = async (req, res) => {
  try {
    const {
      account_id,
      orderItems,
      // address_id ,
      // note ,
      // deliveryType ,
      paymentMethod,
    } = req.body;

    // Tạo các đối tượng OrderItem từ dữ liệu orderItems và lưu chúng vào cơ sở dữ liệu
    const createdOrderItems = await OrderItem.insertMany(orderItems);

    // Lấy danh sách các ID của các OrderItem đã tạo
    const orderItemIds = createdOrderItems.map((item) => item._id);

    const newOrder = new Order({
      account_id,
      orderItems: orderItemIds,
      // address_id ,
      // note ,
      // deliveryType ,
      paymentMethod,
    });
    
    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();
    res.json({ message: "Order success!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
