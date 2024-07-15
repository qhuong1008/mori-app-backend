const readHistory = require("../model/readHistory.model");
const Book = require("../model/book.model");
const Account = require("../model/account.model");

const cleanReadHistory = async () => {
  try {
    // Lấy tất cả các readHistory
    const readHistories = await readHistory.find();

    for (let history of readHistories) {
      const bookExists = await Book.exists({ _id: history.book });
      // const userExists = await Account.exists({ _id: history.user }); --này chắc k cần vì tìm user rồi thì hẳn user đã có

      // Nếu book hoặc user không tồn tại, xóa readHistory
      if (!bookExists) {
        await readHistory.deleteOne({ _id: history._id });
        console.log(`Deleted readHistory with id ${history._id}`);
      }
    }
    console.log("Clean up completed");
  } catch (err) {
    console.error("Error during clean up:", err);
  }
};

// Gọi hàm cleanReadHistory để xóa các readHistory không hợp lệ- Gọi hàm này khi findAllWithUser
// cleanReadHistory();

let getTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const day = currentDate.getDate();
  const time = `${year}-${month}-${day}`;
  return time;
};

exports.createOrUpdateReadHistory = async (req, res) => {
  try {
    const { book, user, position } = req.body;

    const existingHistory = await readHistory.findOne({
      book: book,
      user: user,
    });

    if (existingHistory) {
      // Nếu đã có bản ghi, cập nhật vị trí và thời gian
      existingHistory.position = position;
      existingHistory.time = getTime();
      await existingHistory.save();
    } else {
      // Nếu chưa có, tạo mới bản ghi với vị trí mới
      await readHistory.create({
        book: book,
        user: user,
        time: getTime(),
        position: position,
      });
    }
    res.json({ message: "Lịch sử đọc đã được cập nhật." });
  } catch (error) {
    console.error("Lỗi khi cập nhật lịch sử đọc:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.findAll = async (req, res) => {
  // removeDuplicateMyLibraries();
  const readHistorys = await readHistory.find({}).populate("book").exec();
  res.json({ readHistorys: readHistorys, statusCode: 200 });
};
exports.findAllWithUser = async (req, res) => {
  // await cleanReadHistory();
  try {
    const result = await readHistory
      .find({
        user: req.params.id,
      })
      .populate("book")
      .sort({ time: -1 })
      .exec();
    res.json({ readHistory: result, statusCode: 200 });
  } catch (error) {
    console.error("Error getReadhistories", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const book = req.params.book_id;
    const user = req.params.user_id;

    const existingHistory = await readHistory.findOne({
      book: book,
      user: user,
    });
    if (existingHistory) {
      res.json({ position: existingHistory.position, statusCode: 200 });
      console.log("position", existingHistory.position);
    } else {
      res.json({
        message: "Không có lịch sử đọc trước đó",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm lịch sử đọc", error);
    res.status(500).json({ error: "Server error" });
  }
};

// hàm xóa nếu có bản bị trùng
const removeDuplicateMyLibraries = async () => {
  const allRecords = await readHistory.find({});

  const recordsToDelete = [];
  const recordsToKeep = [];

  // Tìm các bản ghi trùng và giữ lại bản ghi mới nhất
  for (const record of allRecords) {
    const duplicateRecords = recordsToKeep.filter(
      (r) => r.book.equals(record.book) && r.user.equals(record.user)
    );

    if (duplicateRecords.length > 0) {
      // Nếu đã có, tìm bản ghi có thời gian lớn nhất
      const maxTimeRecord = duplicateRecords.reduce(
        (maxRecord, currentRecord) =>
          currentRecord.time > maxRecord.time ? currentRecord : maxRecord
      );

      if (record.time > maxTimeRecord.time) {
        recordsToKeep.splice(recordsToKeep.indexOf(maxTimeRecord), 1);
        recordsToKeep.push(record);
        recordsToDelete.push(maxTimeRecord);
      } else {
        recordsToDelete.push(record);
      }
    } else {
      // Nếu chưa có, thêm vào danh sách giữ lại
      recordsToKeep.push(record);
    }
  }

  // Xóa các bản ghi trùng
  for (const recordToDelete of recordsToDelete) {
    await readHistory.findByIdAndDelete(recordToDelete._id);
  }
};
exports.update = (req, res) => {};

exports.delete = (req, res) => {};
