const MyLibrary = require("../model/myLibrary.model");

exports.create = async (req, res) => {
  const isExist = await MyLibrary.findOne(req.body);
  if (!isExist) {
    var myLibraryDetail = new MyLibrary(req.body);
    await myLibraryDetail
      .save()
      .then(() => {
        res.json("My library added successfully!");
      })
      .catch((err) => console.log(err));
  } else {
    res.json("My library already exists!");
  }
};

exports.addBookToMyLibrary = async function (req, res) {
  try {
    const existingBook = await MyLibrary.findOne(req.body);
    if (existingBook) {
      return res.json(1);
    } else {
      const newBookInMyLibrary = new MyLibrary(req.body);
      await newBookInMyLibrary.save();
      return res.json(0);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
};

exports.getAllBooksInMyLibrary = async (req, res) => {
  // removeDuplicateMyLibraries();
  const userId = req.params.id;
  try {
    const libraryResult = await MyLibrary.find({
      user: userId,
    })
      .populate("book")
      .exec();
    return res.json({ myLibrary: libraryResult });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

exports.deleteBookFromMyLibrary = async (req, res) => {
  try {
    const deletedEntry = await MyLibrary.deleteOne(req.body);

    if (deletedEntry) {
      return res
        .status(200)
        .json({ message: "Xóa sách khỏi thư viện thành công!" });
    } else {
      return res.status(404).json(404);
    }
  } catch (error) {
    console.error("Error removing book from MyLibrary:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findAll = async (req, res) => {
  const myLibraries = await MyLibrary.find({}).populate("book").exec();
  res.json({ myLibraries: myLibraries, statusCode: 200 });
};

exports.findOne = async (req, res) => {
  const myLibrary = await MyLibrary.findOne(req.body).populate("book").exec();
  res.json({ myLibrary: myLibrary, statusCode: 200 });
};

// hàm xóa nếu có bản bị trùng
const removeDuplicateMyLibraries = async () => {
  const allRecords = await MyLibrary.find({});

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
    await MyLibrary.findByIdAndDelete(recordToDelete._id);
  }
};
