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
    return res.status(400).json({ message: "Missing required fields" });
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

    res.status(201).json(savedVoucher); // Created status code (201)
  } catch (error) {
    console.error("Error creating discount voucher:", error);
    // Handle potential errors (e.g., validation errors, database errors)
    if (error.name === "MongoError" && error.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Discount voucher code already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
