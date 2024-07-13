const DiscountVoucher = require("../model/discountVoucher.model");

exports.getAllDiscountVouchers = async (req, res) => {
  try {
    const voucher = await DiscountVoucher.find();

    if (!voucher) {
      return res.status(404).json({ message: "Discount voucher not found" });
    }

    res.status(200).json({ data: voucher });
  } catch (error) {
    console.error("Error fetching discount voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDiscountVoucherById = async (req, res) => {
  const voucherId = req.params.id;

  try {
    const voucher = await DiscountVoucher.findById(voucherId);

    if (!voucher) {
      return res.status(404).json({ message: "Discount voucher not found" });
    }

    res.status(200).json({ data: voucher });
  } catch (error) {
    console.error("Error fetching discount voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createDiscountVoucher = async (req, res) => {
  const { code, discount, description, expiresIn } = req.body;

  if (!code || !discount || !description || !expiresIn) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check for existing voucher code
  const existingVoucher = await DiscountVoucher.findOne({ code });

  if (existingVoucher) {
    return res.status(409).json({ error: "Voucher code already exists" });
  }

  try {
    // Create a new discount voucher instance
    const newVoucher = new DiscountVoucher({
      code,
      discount,
      description,
      expiresIn,
    });

    // Save the voucher to the database
    const savedVoucher = await newVoucher.save();

    res.status(201).json({ message: "Thêm voucher thành công!", savedVoucher }); // Created status code (201)
  } catch (error) {
    console.error("Error creating discount voucher:", error);
    // Handle potential errors (e.g., validation errors, database errors)

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.findVouchersForNewUsers = async () => {
  try {
    const targetVouchers = await DiscountVoucher.find({ code: /WELCOME/i });
    return targetVouchers;
  } catch (err) {
    console.log("err", err);
    return err;
  }
};

exports.editDiscountVoucher = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const { booksBought, code, description, discount, expiresIn } = req.body;
    const updateData = { booksBought, code, description, discount, expiresIn };
    const updatedVoucher = await DiscountVoucher.findByIdAndUpdate(
      voucherId,
      updateData,
      { new: true }
    ); // Options to return the updated document

    res.status(200).send({ message: "Chỉnh sửa voucher thành công" }); // No content on successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteDiscountVoucher = async (req, res) => {
  const voucherId = req.params.id;

  try {
    const deletedVoucher = await DiscountVoucher.findByIdAndDelete(voucherId);
    if (!deletedVoucher) {
      return res.status(404).send({ error: "Internal server error" });
    }
    res.status(200).send({ message: "Xóa voucher thành công" }); // No content on successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.findWelcomeVouchers = async () => {
  try {
    const vouchers = await DiscountVoucher.find({
      code: { $regex: "WELCOME", $options: "i" },
    });
    return vouchers;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
