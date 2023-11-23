const Review = require("../model/review.model");

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

    if (existingRating && existingRating.content == null) {
      return res
        .status(400)
        .json({ error: "You have already rated this book." });
    }

    // Nếu chưa đánh giá *sao, tạo mới đánh giá
    let newRating = new Review({
      user_id: user_id,
      book_id: book_id,
      rating: rating,
    });

    await newRating.save();
    return res
      .status(200)
      .json({ rating: rating, message: "Rating added successfully!" });
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
    let newReview = new Review({
      user_id: user_id,
      book_id: book_id,
      rating: rating,
      content: content,
    });

    // Kiểm tra xem người dùng đã nhập đầy đủ nội dung comment hay chưa
    if (!content) {
      return res.status(400).json({ error: "Please enter comment content." });
    }

    await newReview.save();

    return res.status(200).json({
      newReview: newReview,
      message: "Comment and rating added successfully!",
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// get reviews by book
exports.getReviewsByBook = async (req, res) => {
  try {
    const book_id = req.params.book_id;

    // Lấy tất cả các đánh giá có nội dung cho quyển sách
    const reviews = await Review.find({
      book_id,
      content: { $ne: null },
    }).populate("user_id");

    if (reviews.length > 0) {
      res.json({ reviews: reviews, statusCode: 200 });
    } else {
      res.json({ message: "No reviews found for the book", statusCode: 200 });
    }
    return res.status(200).json(reviews);
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// update review
exports.updateReview = async (req, res) => {
  try {
    const review_id = req.params.id; //truyền qua parameter
    const content = req.body.content;

    // Kiểm tra xem comment tồn tại hay không
    const existingReview = await Review.findOne({ _id: review_id, user_id });

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

    return res.status(200).json("Comment updated successfully!");
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    let deletedComment = await Review.findByIdAndRemove({ id: id });
    if (deletedComment) {
      res.json({ message: "Comment deleted successfully.", statusCode: 200 });
    } else {
      res.json({ message: "Comment not found.", statusCode: 404 });
    }
  } catch (err) {
    console.error("Error delete comment: ", err);
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

exports.postReact = async function (req, res) {};
