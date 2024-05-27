const readingGoal = require("../model/readingGoal.model");

exports.findByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const readingGoals = await readingGoal.find({ user: userId });

    if (!readingGoals) {
      return res
        .status(200)
        .json({ message: "No reading goals found for this user" });
    }

    res.status(200).send(readingGoals);
  } catch (err) {
    console.error("Error fetching reading goals:", err);
    res.status(500).send("Internal server error");
  }
};

exports.createReadingGoal = async (req, res) => {
  const { user, goalType, goalAmount, timeFrame } = req.body;

  // Basic validation (more can be added)
  if (!user || !goalType || !goalAmount || !timeFrame) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newReadingGoal = new readingGoal({
      user,
      goalType,
      goalAmount,
      timeFrame,
    });

    await newReadingGoal.save();

    res.status(201).send(newReadingGoal);
  } catch (err) {
    console.error("Error creating reading goal:", err);
    res.status(500).send("Internal server error");
  }
};

// hàm chỉnh sửa số lượng đọc và loại mục tiêu
exports.editReadingGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const existingGoal = await readingGoal.findById(goalId);

    if (!existingGoal) {
      return res.status(404).send("Reading goal not found");
    }

    // Update only specified fields (if present in request body)
    await readingGoal.updateOne(
      { _id: goalId },
      {
        $set: {
          goalType: req.body.goalType
            ? req.body.goalType
            : existingGoal.goalType,
          goalAmount: req.body.goalAmount
            ? req.body.goalAmount
            : existingGoal.goalAmount,
        },
      }
    );

    res
      .status(200)
      .json({ message: "Chỉnh sửa mục tiêu đọc sách thành công!" }); // You can fetch the updated goal if needed
  } catch (err) {
    console.error("Error editing reading goal:", err);
    res.status(500).send("Internal server error");
  }
};

exports.resetReadingProgress = async (req, res) => {
  const { goalId } = req.params;

  try {
    const updatedReadingGoal = await readingGoal
      .findById(goalId)
      .populate("booksRead");

    if (!updatedReadingGoal) {
      return res.status(404).send("Reading goal not found");
    }
    const today = new Date();

    if (updatedReadingGoal.timeFrame === "day") {
      // Check if goal was created today
      if (
        today.getDate() === updatedReadingGoal.createdAt.getDate() &&
        today.getMonth() === updatedReadingGoal.createdAt.getMonth() &&
        today.getFullYear() === updatedReadingGoal.createdAt.getFullYear()
      ) {
        // nếu chưa qua ngày mới thì ko cần dọn data về rỗng
        // ko cần làm gì
      } else {
        // Goal created on a different day, reset progress
        updatedReadingGoal.booksRead = [];
      }
    } else if (updatedReadingGoal.timeFrame === "week") {
      // Calculate the start of the current week (Sunday)
      const currentWeekStart = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      // Check if goal was created within the current week
      if (
        currentWeekStart <= updatedReadingGoal.createdAt &&
        updatedReadingGoal.createdAt <
          new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        // Goal created this week, keep existing booksRead
      } else {
        // Goal created in a different week, reset progress
        updatedReadingGoal.booksRead = [];
      }
    }

    // After recalculating progress, save the updated updatedReadingGoal
    await updatedReadingGoal.save();

    res.status(200).send({
      message: "Đã reset lại data cho mục tiêu đọc sách.",
      progress: updatedReadingGoal.booksRead.length, // Assuming booksRead holds references to completed books
      goalAmount: updatedReadingGoal.goalAmount,
    });
  } catch (err) {
    console.error("Error fetching reading goal progress:", err);
    res.status(500).send("Internal server error");
  }
};

exports.updateReadPages = async (req, res) => {
  try {
    const userId = req.params.userId;

    const updateResult = await readingGoal.updateMany(
      { user: userId },
      { $inc: { pagesRead: 1 } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({
        message: `${updateResult.modifiedCount} reading goals updated successfully.`,
      });
    } else {
      res
        .status(404)
        .json({ message: "No reading goals found for the provided user." });
    }
  } catch (error) {
    console.error("Error updating readPages:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateReadBooks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    // Check if book already exists
    const existingGoal = await readingGoal.findOne({
      user: userId,
      booksRead: bookId,
    });

    if (!existingGoal) {
      return res
        .status(404)
        .json({ message: "No reading goals found for the provided user." });
    }
    // Check if book already exists (optional)
    const bookExists = existingGoal.booksRead.some(
      (id) => id.toString() === bookId
    );
    if (bookExists) {
      return res
        .status(409)
        .json({ message: "Book already exists in reading goals." });
    }

    const updateResult = await readingGoal.updateMany(
      { user: userId },
      { $push: { booksRead: bookId } }
    );

    res.json({
      message: "Book ID added to reading goals successfully.",
      updateResult,
    });
  } catch (error) {
    console.error("Error adding book ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
