const axios = require("axios");
const Book = require("../model/book.model");
const mongoose = require("mongoose");
const Recommendation = require("../model/recommendation.model");
const fs = require("fs");
const ReadHistory = require("../model/readHistory.model");
const Account = require("../model/account.model");

// recommend của từng quyển sách
exports.getRecommendationsOfBook = async (req, res) => {
  try {
    const book_id = req.params.id;
    const recommendations = await Recommendation.findOne({ bookId: book_id });

    if (!recommendations) {
      return res.status(404).json({ message: "Recommendations not found" });
    }

    // Trích xuất chỉ danh sách book_id từ recommendations
    const bookIds = recommendations.recommendations;

    const recommendedBooks = await Book.find({ _id: { $in: bookIds } });

    res.json({ recommendations: recommendedBooks, statusCode: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// gọi mỗi khi có quyển sách mới được thêm vào
exports.createRecommendations = async (req, res) => {
  try {
    const allBooks = await Book.find();

    // Gọi API Python để lấy gợi ý sách
    const response = await axios.post("http://127.0.0.1:8000/recommendations", {
      allBooks: allBooks,
    });

    const recommendationsData = response.data.recommendations;
    console.log("recommendationsData: ", recommendationsData);

    for (const rec of recommendationsData) {
      await Recommendation.updateOne(
        { bookId: rec.book_id },
        {
          $set: {
            recommendations: rec.recommendations.map((id) => id),
          },
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Recommendations updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.createOrUpdateUserRecommendations = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    // Tìm lịch sử đọc của người dùng
    const userReadHistory = await ReadHistory.find({ user: user_id }).sort({ time: -1 });

    // Lấy danh sách các cuốn sách đã đọc bởi người dùng
    const userReadBooks = userReadHistory.map((history) => history.book);

    // Số lượng cuốn sách đã đọc
    const numReadBooks = userReadBooks.length;

    let numRecommendationsPerBook;
    if (numReadBooks === 1) {
      numRecommendationsPerBook = 10;
    } else if (numReadBooks === 2) {
      numRecommendationsPerBook = 7;
    } else {
      numRecommendationsPerBook = 5;
    }

    // Lấy danh sách cuốn sách để thực hiện tìm kiếm recommendations
    const searchBooks = userReadBooks.slice(0, 5); // Chỉ lấy 5 cuốn đầu

    // Tìm recommendations cho từng cuốn sách đã đọc
    const userRecommendations = [];
    for (const book_id of searchBooks) {
      const recommend = await Recommendation.findOne({ bookId: book_id });
      if (recommend) {
        userRecommendations.push(
          recommend.recommendations.slice(0, numRecommendationsPerBook)
        ); // đặt giới hạn để đa dạng sách gợi ý
      }
    }

    // Kết hợp danh sách gợi ý từ các cuốn sách đã đọc mà không ghi đè lên nhau
    const mergedRecommendations = userRecommendations.flat();

    // Lọc bỏ các cuốn sách đã đọc trước đó - giới hạn dưới 15 quyển
    const filteredRecommendations = mergedRecommendations
      .filter((book_id) => !userReadBooks.includes(book_id))
      .slice(0, 15);

    // lưu lại vào database
    const user = await Account.findById(user_id);
    user.recommendations = filteredRecommendations;
    await user.save();

    console.error(
      "UserRecommendations create successfully for user " + user._id
    );
    // return recommendedBooks;
  } catch (err) {
    console.error("error create user recommendations", err);
  }
};


////////////////////// hàm này dùng để tạo UserRecommendations lần đầu
exports.createAllUserRecommendations = async (req, res) => {
  try {
    const accounts = await Account.find({});

    accounts.forEach((account) => {
      createOrUpdateUserRecommendations(account._id);
    });

    res
      .status(200)
      .json({ message: "UserRecommendations create successfully" });
    console.log("UserRecommendations create successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
