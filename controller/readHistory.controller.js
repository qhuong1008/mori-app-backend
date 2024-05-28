const readHistory = require("../model/readHistory.model");

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
    res.status(500).json({ error: "error", message: "Đã có lỗi xảy ra." });
  }
};

exports.findAll = async (req, res) => {
  // removeDuplicateMyLibraries();
  const readHistorys = await readHistory.find({}).populate("book").exec();
  res.json({ readHistorys: readHistorys, statusCode: 200 });
};
exports.findAllWithUser = async (req, res) => {
  const result = await readHistory
    .find({
      user: req.params.id,
    })
    .populate("book").exec();
  res.json({ readHistory: result, statusCode: 200 });
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
    } else {
      res.json({
        message: "Không có lịch sử đọc trước đó",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm lịch sử đọc", error);
    res.status(500).json({ error: "error", message: "Đã có lỗi xảy ra." });
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
      const maxTimeRecord = duplicateRecords.reduce((maxRecord, currentRecord) =>
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
