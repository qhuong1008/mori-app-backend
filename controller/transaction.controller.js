const userVoucherController = require("../controller/userVoucher.controller");
const notiController = require("../controller/notification.controller");
const Transaction = require("../model/transaction.model");
const discountVoucher = require("../model/discountVoucher.model");
const moment = require("moment");

exports.create = async (req, res) => {
  var transactionData = new Transaction(req.body);
  // Tìm kiếm giao dịch đã tồn tại dựa trên tài khoản và sản phẩm
  const existingTransaction = await Transaction.findOne({
    account: transactionData.account,
    product: transactionData.product,
  });

  if (existingTransaction) {
    return res
      .status(400)
      .json({ message: "Sản phẩm này đã được mua trước đó" });
  }
  const newTransaction = new Transaction(transactionData);
  try {
    const userVoucherId = req.body.userVoucher;
    if (userVoucherId) {
      // cập nhật trạng thái voucher sang đã dùng
      await userVoucherController.updateUserVoucherUsedStatus(userVoucherId);
    }
    // nếu user mua dc N sách lẻ thì dc tặng voucher tương ứng
    const savedTransaction = await newTransaction.save().then(() => {
      this.checkUserLoyaltyThenGiveNewVoucher(
        transactionData.account,
        userVoucherId
      );
    });
    res.status(200).json({ transaction: savedTransaction, statusCode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserTrans = async (req, res) => {
  const { account, type } = req.query;
  // Kiểm tra xem account và type đã được cung cấp hay chưa
  if (!account || !type) {
    return res.status(400).json({ error: "Missing account or type parameter" });
  }
  try {
    const transactions = await Transaction.find({
      account: account,
      productType: type,
    })
      .populate("product")
      .exec();
    res.json({ transactions: transactions, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate("account")
      .populate("productType")
      .exec();
    res.json({ data: transactions, statusCode: 200 });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ err: err });
  }
};

exports.listTransactionsByDateRange = async (req, res) => {
  const { fromMonth, toMonth, fromYear, toYear } = req.query;
  if (!fromMonth || !toMonth || !fromYear || !toYear) {
    return res
      .status(400)
      .json({ message: "Missing required query parameters" });
  }

  try {
    const startDate = moment()
      .month(fromMonth - 1)
      .year(fromYear)
      .startOf("month"); // Adjust for 0-based month indexing
    const endDate = moment()
      .month(toMonth - 1)
      .year(toYear)
      .endOf("month"); // Adjust for 0-based month indexing

    const transactions = await Transaction.find({
      time: {
        $gte: startDate.toDate(), // Greater than or equal to start date
        $lte: endDate.toDate(), // Less than or equal to end date
      },
    })
      .populate("account")
      .populate("productType")
      .exec(); // Include populated product details
    console.log(("transactions", transactions));
    res.json({ transactions: transactions, statusCode: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
};

exports.checkUserLoyaltyThenGiveNewVoucher = async (
  accountId,
  userVoucherId
) => {
  try {
    const retailBookTransactions = await Transaction.find({
      account: accountId,
      productType: "Book",
    });
    if (retailBookTransactions.length === 1) {
      // Giảm 20% khi mua 1 cuốn sách bán lẻ bất kì
      const targetVoucher = await discountVoucher.findOne({
        code: "LOYALTY20",
      });
      console.log("targetVoucher", targetVoucher);
      await userVoucherController.createUserVoucherAction(
        accountId,
        targetVoucher._id
      );
      // gửi thông báo người dùng đã được nhận voucher giảm giá
      await notiController.createNewVoucherReceivedNotification(
        accountId,
        userVoucherId
      );
    }
  } catch (err) {
    console.error(err);
  }
};
