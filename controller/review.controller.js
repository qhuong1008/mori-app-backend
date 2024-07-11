const Review = require("../model/review.model");
const Account = require("../model/account.model");
const mongoose = require("mongoose");
// rating book
exports.ratingBook = async (req, res) => {
  try {
    const book_id = req.body.book_id;
    const user_id = req.body.user_id;
    const rating = req.body.rating;

    // Kiểm tra xem người dùng đã đánh giá *sao sách chưa
    const existingRating = await Review.findOne(
      { book_id },
      { user_id },
      { content: null }
    );

    console.log("existingRating", existingRating);

    if (existingRating && existingRating.content == null) {
      return res
        .status(400)
        .json({ error: "Bạn đã thêm rating cho cuốn sách này rồi." });
    }
    const account = await Account.findById(user_id);

    // Nếu chưa đánh giá *sao, tạo mới đánh giá
    let newRating = new Review({
      user: account,
      book_id: book_id,
      rating: rating,
    });

    await newRating.save();
    return res
      .status(200)
      .json({ rating: rating, message: "Thêm rating thành công!" });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// review book
exports.reviewBook = async (req, res) => {
  try {
    const book_id = req.body.book_id;
    const user_id = req.body.user_id;
    const rating = req.body.rating;
    const content = req.body.content;

    // tạo mới đánh giá và nhận xét
    const newReview = new Review({
      user: user_id,
      book_id: book_id,
      rating: rating,
      content: content,
    });

    // Kiểm tra xem người dùng đã nhập đầy đủ nội dung Review hay chưa
    if (!content) {
      return res.status(400).json({ error: "Please enter comment content." });
    } else {
      const reviewSave = await newReview.save();

      return res.status(200).json({
        newReview: reviewSave,
        message: "Comment and rating added successfully!",
      });
    }
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// get ratings by book
exports.getRatingsByBook = async (req, res) => {
  try {
    const bookId = new mongoose.Types.ObjectId(req.params.id);

    // Tính tổng số lượt review
    const totalReviews = await Review.countDocuments({ book_id: bookId });
    console.log(totalReviews)

    // Tính tổng rating
    const totalRating = await Review.aggregate([
      { $match: { book_id: bookId } },
      { $group: { _id: null, totalRating: { $sum: "$rating" } } },
    ]);
    console.log(totalRating);

    // Tính rating trung bình
    const averageRating =
      totalRating.length > 0 ? totalRating[0].totalRating / totalReviews : 0;

    res.status(200).json({
      totalReviews: totalReviews,
      averageRating: averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error", message: error.message });
  }
};

// get reviews by book
exports.getReviewsByBook = async (req, res) => {
  try {
    const book_id = req.params.id;

    const reviews = await Review.find({
      book_id: book_id,
      content: { $exists: true },
    })
      .populate("user")
      .exec();

    res.json({ reviews: reviews, statusCode: 200 });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: err });
  }
};

// update review
exports.updateReview = async (req, res) => {
  try {
    const review_id = req.params.id; //truyền qua parameter
    const content = req.body.content;

    // Kiểm tra xem comment tồn tại hay không
    const existingReview = await Review.findOne({
      _id: review_id,
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Cập nhật nội dung comment
    existingReview.content = content;

    // Kiểm tra xem người dùng đã nhập đầy đủ nội dung comment hay chưa
    if (!content) {
      return res.status(400).json({ error: "Please enter comment content." });
    }

    await existingReview.save();

    return res.status(200).json({ message: "Comment updated successfully!" });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    let deletedComment = await Review.findByIdAndDelete(id);
    if (deletedComment) {
      res.json({ message: "Review deleted successfully.", statusCode: 200 });
    } else {
      res.json({ message: "Review not found.", statusCode: 404 });
    }
  } catch (err) {
    console.error("Error delete Review: ", err);
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

exports.postReact = async function (req, res) {};
