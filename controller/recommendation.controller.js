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

// recommend của user
exports.getUserRecommendations = async (req, res) => {
  try {
    const user_id = req.params.id;
    const account = await Account.findById(user_id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Trích xuất chỉ danh sách book_id từ recommendations
    const bookIds = account.recommendations;

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
    const allBooks = await Book.find({}, "name author intro tags").lean();

    // Gọi API Python để lấy gợi ý sách
    const response = await axios.post(
      `${process.env.NLP_URL}/nlp/recommendcb/create-recommend`,
      {
        allBooks: allBooks,
      }
    );

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

// được gọi mỗi khi người dùng đọc một quyển sách mới
exports.createOrUpdateUserRecommendations = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const book_id = req.body.book_id;
    console.log("user", user_id);

    // Truy vấn lịch sử đọc của người dùng, sắp xếp theo thời gian đọc gần nhất và lấy 5 cuốn sách gần nhất
    const userReadHistory = await ReadHistory.find({ user: user_id })
      .sort({ time: -1 }) // Giả sử "readAt" là trường lưu thời gian đọc
      .limit(5) // chỉ lấy 5 cuốn đầu để recommend thôi
      .select("book")
      .lean(); // Lấy trường "book" và trả về đối tượng đơn giản

    // Lấy danh sách ID các cuốn sách từ lịch sử đọc
    const recentBooks = userReadHistory.map((history) =>
      history.book.toString()
    );

    // Kiểm tra xem cuốn sách hiện tại có nằm trong danh sách 5 cuốn sách gần nhất hay không
    const isBookInRecentHistory = recentBooks.includes(book_id);

    if (isBookInRecentHistory) {
      res
        .status(200)
        .json({ message: "User recommendations successfully" });
    } else {
      // Lấy danh sách các cuốn sách đã đọc bởi người dùng
      const userHistories = userReadHistory.map((history) =>
        history.book.toString()
      );

      // In ra dữ liệu gửi đi
      const requestData = {
        user_id: user_id,
        user_history: userHistories,
        n: 15, // giới hạn gợi ý của 1 người dùng là 15 cuốn
      };
      // console.log("Request Data:", requestData);

      const response = await axios.post(
        `${process.env.NLP_URL}/nlp/recommend/history`,
        requestData
      );

      // Kiểm tra phản hồi từ FastAPI
      if (response.status == 200 && response.data) {
        console.log("response.data", response.data);
        // lưu lại vào database
        const user = await Account.findById(user_id);
        user.recommendations = response.data.recommendations;
        await user.save();

        console.log(
          "UserRecommendations created successfully for user " + user._id
        );
        res
          .status(200)
          .json({ message: "User recommendations updated successfully" });
      } else {
        console.error("Failed to get recommendations from FastAPI");
        res.status(500).json({ message: "Failed to get recommendations" });
      }
    }
  } catch (err) {
    console.error("error create user recommendations", err);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};

// hàm này recommendations dựa trên content based
// exports.createOrUpdateUserRecommendations = async (req, res) => {
//   try {
//     const user_id = req.body.user_id;

//     // Tìm lịch sử đọc của người dùng
//     const userReadHistory = await ReadHistory.find({ user: user_id }).sort({ time: -1 });

//     // Lấy danh sách các cuốn sách đã đọc bởi người dùng
//     const userReadBooks = userReadHistory.map((history) => history.book);

//     // Số lượng cuốn sách đã đọc
//     const numReadBooks = userReadBooks.length;

//     let numRecommendationsPerBook;
//     if (numReadBooks === 1) {
//       numRecommendationsPerBook = 10;
//     } else if (numReadBooks === 2) {
//       numRecommendationsPerBook = 7;
//     } else {
//       numRecommendationsPerBook = 5;
//     }

//     // Lấy danh sách cuốn sách để thực hiện tìm kiếm recommendations
//     const searchBooks = userReadBooks.slice(0, 5); // Chỉ lấy 5 cuốn đầu

//     // Tìm recommendations cho từng cuốn sách đã đọc
//     const userRecommendations = [];
//     for (const book_id of searchBooks) {
//       const recommend = await Recommendation.findOne({ bookId: book_id });
//       if (recommend) {
//         userRecommendations.push(
//           recommend.recommendations.slice(0, numRecommendationsPerBook)
//         ); // đặt giới hạn để đa dạng sách gợi ý
//       }
//     }

//     // Kết hợp danh sách gợi ý từ các cuốn sách đã đọc mà không ghi đè lên nhau
//     const mergedRecommendations = userRecommendations.flat();

//     // Lọc bỏ các cuốn sách đã đọc trước đó - giới hạn dưới 15 quyển
//     const filteredRecommendations = mergedRecommendations
//       .filter((book_id) => !userReadBooks.includes(book_id))
//       .slice(0, 15);

//     // lưu lại vào database
//     const user = await Account.findById(user_id);
//     user.recommendations = filteredRecommendations;
//     await user.save();

//     console.error(
//       "UserRecommendations create successfully for user " + user._id
//     );
//     // return recommendedBooks;
//   } catch (err) {
//     console.error("error create user recommendations", err);
//   }
// };

////////////////////// hàm này dùng để tạo UserRecommendations lần đầu
exports.createAllUserRecommendations = async (req, res) => {
  try {
    const accounts = await Account.find({});

    accounts.forEach((account) => {
      createUserRecommendations(account._id);
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

const createUserRecommendations = async (user_id) => {
  try {
    // Tìm lịch sử đọc của người dùng
    const userReadHistory = await ReadHistory.find({ user: user_id }).sort({
      time: -1,
    });

    // Lấy danh sách các cuốn sách đã đọc bởi người dùng
    const userReadBooks = userReadHistory.map((history) =>
      history.book.toString()
    );

    // Lấy danh sách cuốn sách để thực hiện tìm kiếm recommendations
    const userHistories = userReadBooks.slice(0, 5); // Chỉ lấy 5 cuốn đầu

    // In ra dữ liệu gửi đi
    const requestData = {
      user_id: user_id,
      user_history: userHistories,
      n: 15, // giới hạn gợi ý của 1 người dùng là 15 cuốn
    };
    console.log("Request Data:", requestData);

    const response = await axios.post(
      "http://127.0.0.1:8000/nlp/recommend/history",
      requestData
    );

    // Kiểm tra phản hồi từ FastAPI
    if (response.status == 200 && response.data) {
      console.log("response.data", response.data);
      // lưu lại vào database
      const user = await Account.findById(user_id);
      user.recommendations = response.data.recommendations;
      await user.save();

      console.log(
        "UserRecommendations created successfully for user " + user._id
      );
    } else {
      console.error("Failed to get recommendations from FastAPI");
    }
  } catch (err) {
    console.error("error create user recommendations", err);
  }
};
