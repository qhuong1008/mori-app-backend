const Transaction = require("../model/transaction.model");

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
    const savedTransaction = await newTransaction.save();
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
    const transactions = await Transaction.find({ account: account, productType: type }).populate('product');;
    res.json({ transactions: transactions, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find({})
    .populate("account")
    .populate("productType");

  res.json({ data: transactions, statusCode: 200 });
};
