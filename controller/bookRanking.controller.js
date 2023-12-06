const BookRanking = require("../model/bookRanking.model");
const Book = require("../model/book.model");

// Hàm tăng số lượt đọc trong ngày của quyển sách đó
exports.increaseTotalReadDaily = async (req, res) => {
  const book_id = req.params.id;

  try {
    // Kiểm tra xem đã có xếp hạng cho cuốn sách trong ngày chưa
    let bookRanking = await BookRanking.findOne({
      book_id,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    // hàm này cập nhật lại lượt đọc -> lướt xuống dưới cùng để xem
    updateTotalRead(book_id);

    if (bookRanking) {
      // Nếu đã có, cập nhật total_read
      await bookRanking.updateOne({
        $inc: {
          totalRead: 1,
        },
      });
      res.json({
        message: "Increase total read daily successfully!",
        totalRead: bookRanking.totalRead,
        statusCode: 200,
      });
    } else {
      // Nếu chưa có, tạo mới xếp hạng
      const newBookRanking = await BookRanking.create({ book_id });
      // và tăng thêm 1
      await newBookRanking.updateOne({
        $inc: {
          totalRead: 1,
        },
      });
      res.json({
        message: "Book ranking of " + new Date() + " created successfully!",
        statusCode: 201,
      });
    }
  } catch (error) {
    console.error("Error updating book ranking:", error);
    res.json({ error, statusCode: 500 });
  }
};

// API để lấy bảng xếp hạng sách theo lượt đọc
//   Được lọc theo xếp hạng ngày, tuần, tháng
//   Giới hạn kết quả trả về chỉ 10 cuốn sách
exports.getBookRanking = async (req, res) => {
  const { interval } = req.params;
  try {
    let startDate, endDate;

    switch (interval) {
      case "daily":
        console.log("call ranking daily");
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;

      case "weekly":
        console.log("call ranking weekly");
        endDate = new Date(); // Ngày hiện tại
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date(endDate); // Sao chép ngày hiện tại
        startDate.setDate(startDate.getDate() - 6); // Lùi ngày về 6 ngày

        startDate.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây của startDate về 0
        break;

      case "monthly":
        console.log("call ranking monthly");
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); //set về ngày này tháng trước
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        return res.status(400).json({ message: "Invalid interval" });
    }

    const rankingData = await BookRanking.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$book_id",
          totalRead: { $sum: "$totalRead" },
        },
      },
      {
        $sort: {
          totalRead: -1,
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $unwind: "$bookInfo",
      },
      {
        $project: {
          _id: 0,
          book_id: "$_id",
          totalRead: 1,
          bookInfo: 1,
        },
      },
      {
        $limit: 10, // Giới hạn kết quả trả về chỉ 10 cuốn sách
      },
    ]);

    res.json({
      rankingData,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error getting book ranking:", error);
    res.json({ error, statusCode: 500 });
  }
};

// API để lấy xếp số lượt đọc của 1 quyển sách trong ngày gần đây (tùy chỉnh)
// này chỉ lấy được 1 quyển
exports.getBookRankingPreviousOfBook = async (req, res) => {
  const bookId = req.params.book_id;
  const previous = req.params.previous;

  console.log(bookId);

  try {
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - previous);
    console.log(previousDate);
    console.log(new Date());

    // Tìm sách trong cơ sở dữ liệu
    const bookRankings = await BookRanking.find({
      book_id: bookId,
      date: {
        $gte: previousDate.setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    // Tính tổng số lượt đọc sách trong vòng previous ngày trước đó
    let totalReadCount = 0;
    for (const bookRanking of bookRankings) {
      totalReadCount += bookRanking.totalRead;
    }

    if (bookRankings) {
      res.json({ totalReadCount, statusCode: 200 });
    } else {
      res.json({
        message: "No ranking found for " + previous + " the date before.",
        statusCode: 404,
      });
    }
  } catch (error) {
    res.json({ error, statusCode: 500 });
  }
};

// API để lấy xếp hạng sách trong một ngày cụ thể - đang để mặc định là ngày hôm nay
//- api này chỉ dùng để test xem hàm totalread chạy đúng không chứ k có chức năng cần tới hàm này (chắc vậy =)))
exports.getBookRankingDateOfBook = async (req, res) => {
  const book_id = req.params.id;

  try {
    const ranking = await BookRanking.findOne({
      book_id,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (ranking) {
      res.json({ totalRead: ranking.totalRead, statusCode: 200 });
    } else {
      res.json({
        message: "No ranking found for the specified date.",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.error("Error getting book ranking by date:", error);
    res.json({ error, statusCode: 500 });
  }
};

// chỉ dùng khi nào cần check lại đồng bộ
const updateAllTotalRead = async () => {
  try {
    // Lấy danh sách tất cả các sách
    const allBooks = await Book.find({}, "_id");

    // Lặp qua từng sách
    for (const book of allBooks) {
      await updateTotalRead(book._id);
    }

    console.log("All totalRead updated successfully");
  } catch (error) {
    console.error(`Error updating all totalRead: ${error.message}`);
  }
};

// Hàm tổng hợp lượt đọc và cập nhật Book.totalRead
const updateTotalRead = async (bookId) => {
  try {
    // Tính toán tổng lượt đọc từ bookRanking
    const rankingData = await BookRanking.aggregate([
      { $match: { book_id: bookId } },
      { $group: { _id: null, totalRead: { $sum: "$totalRead" } } },
    ]);

    const totalRead = rankingData.length > 0 ? rankingData[0].totalRead : 0;

    // Cập nhật giá trị Book.totalRead
    await Book.updateOne({ _id: bookId }, { totalRead: totalRead });

    console.log(`Updated totalRead for Book with ID ${bookId}: ${totalRead}`);
  } catch (error) {
    console.error(`Error updating totalRead: ${error.message}`);
  }
};
