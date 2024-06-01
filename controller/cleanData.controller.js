const Account = require("../model/account.model");
// const Book = require("../model/book.model");
const BookRanking = require("../model/bookRanking.model");
const MyLibrary = require("../model/myLibrary.model");
const ReadHistory = require("../model/readHistory.model");
const Review = require("../model/review.model");

////////////////////////// ref Book
exports.cleanBookRanking = async (Book) => {
  try {
    // Lấy tất cả
    const bookrankings = await BookRanking.find();

    for (let bookranking of bookrankings) {
      const bookExists = await Book.exists({ _id: bookranking.book_id });

      // Nếu book không tồn tại, xóa
      if (!bookExists) {
        await BookRanking.deleteOne({ _id: bookranking._id });
        console.log(`Deleted BookRanking with id ${bookranking._id}`);
      }
    }
    console.log("Clean up completed");
  } catch (err) {
    console.error("Error during clean up:", err);
  }
};

exports.cleanMyLibrary = async (Book) => {
  try {
    // Lấy tất cả
    const myLibraries = await MyLibrary.find();

    for (let myLibrary of myLibraries) {
      const bookExists = await Book.exists({ _id: myLibrary.book });
      const userExists = await Account.exists({ _id: myLibrary.user });

      // Nếu book không tồn tại, xóa
      if (!bookExists || !userExists) {
        await MyLibrary.deleteOne({ _id: myLibrary._id });
        console.log(`Deleted MyLibrary with id ${myLibrary._id}`);
      }
    }
    console.log("Clean up completed");
  } catch (err) {
    console.error("Error during clean up:", err);
  }
};

exports.cleanReadHistory = async (Book) => {
  try {
    // Lấy tất cả các readHistory
    const readHistories = await ReadHistory.find();

    for (let history of readHistories) {
      const bookExists = await Book.exists({ _id: history.book });
      const userExists = await Account.exists({ _id: history.user });

      // Nếu book hoặc user không tồn tại, xóa readHistory
      if (!bookExists || !userExists) {
        await ReadHistory.deleteOne({ _id: history._id });
        console.log(`Deleted readHistory with id ${history._id}`);
      }
    }
    console.log("Clean up completed");
  } catch (err) {
    console.error("Error during clean up:", err);
  }
};

exports.cleanReview = async () => {
  try {
    // Lấy tất cả các readHistory
    const reviews = await Review.find();

    for (let review of reviews) {
      const bookExists = await Book.exists({ _id: review.book });
      const userExists = await Account.exists({ _id: review.user });

      // Nếu book hoặc user không tồn tại, xóa readHistory
      if (!bookExists || !userExists) {
        await Review.deleteOne({ _id: review._id });
        console.log(`Deleted Review with id ${review._id}`);
      }
    }
    console.log("Clean up completed");
  } catch (err) {
    console.error("Error during clean up:", err);
  }
};


////////////////////////// ref Account