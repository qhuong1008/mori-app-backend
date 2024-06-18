const UserVoucher = require("../model/userVoucher.model");
const DiscountVoucher = require("../model/discountVoucher.model");

exports.createUserVoucher = async (req, res) => {
  const { account, voucher } = req.body;

  // Basic validation
  if (!account || !voucher) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Fetch the associated DiscountVoucher document
    const voucherValue = await DiscountVoucher.findById(voucher);

    if (!voucherValue) {
      return res.status(404).json({ message: "Discount voucher not found" });
    }

    console.log("voucherValue.expiresIn", voucherValue.expiresIn);
    // Calculate expiration date based on voucher's expiresIn
    const expiresDate = new Date(
      Date.now() + voucherValue.expiresIn * 24 * 60 * 60 * 1000
    );

    // Create a new user voucher instance
    const newUserVoucher = new UserVoucher({
      account: account,
      voucher: voucher,
      expiresDate: expiresDate,
    });

    const savedUserVoucher = await newUserVoucher.save();

    res.status(200).json(savedUserVoucher);
  } catch (error) {
    console.error("Error creating user voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserVoucherUsedStatus = async (req, res) => {
  const userVoucherId = req.params.id;

  try {
    // Find the user voucher document by ID
    const userVoucher = await UserVoucher.findByIdAndUpdate(
      userVoucherId,
      { used: true, usedDate: Date.now() }, // Update used and usedDate
      { new: true } // Return the modified document
    );

    if (!userVoucher) {
      return res.status(404).json({ message: "User voucher not found" });
    }

    res.status(200).json(userVoucher);
  } catch (error) {
    console.error("Error marking user voucher as used:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUserVouchersById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user vouchers with matching account ID (assuming user ID maps to account ID)
    const userVouchers = await UserVoucher.find({ account: userId }).populate(
      "voucher"
    );

    if (!userVouchers.length) {
      return res.status(200).json({ message: "No user vouchers found" });
    }

    res.status(200).json({ data: userVouchers }); // Return the user voucher documents
  } catch (error) {
    console.error("Error fetching user vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
