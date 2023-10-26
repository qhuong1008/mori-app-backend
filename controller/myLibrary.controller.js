const MyLibrary = require("../model/myLibrary.model");

// khởi tạo cùng với tài khoản
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
  const user = res.locals.account;
  const bookId = req.body;
  try {
    const existingBook = await MyLibrary.findOne({
      user: user.id,
      book: bookId,
    });
    if (existingBook) {
      return res
        .status(400)
        .json({ error: "This book is already in your MyLibrary" });
    }
    const newBookInMyLibrary = new Book({
      user: user.id,
      book: bookId,
      status: "unread",
      currentPage: 1, // Trang hiện tại khi thêm vào
      progress: 0, // Tiến độ đọc
    });
    await newBookInMyLibrary.save();
    return res.status(200).json({
      message: "Book added to MyLibrary successfully",
      entry: newBookInMyLibrary,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

exports.getAllBookInMyLibrary = async (req, res) => {
  const user = res.locals.account;
  MyLibrary.find({ user: user.id }, ["user", "book", "progress"])
    .populate({
      path: "book",
      select: ["id", "name", "author", "image", "is_active"],
      match: { is_active: 1 },
    })
    .then((booksInMyLibrary) => {
      res.status(200).json(booksInMyLibrary);
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong" });
      console.log(err);
    });
};

exports.deleteBookFromMyLibrary = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = res.locals.account;

    // Xóa sách khỏi myLibrary của người dùng
    const deletedEntry = await MyLibrary.findOneAndRemove({
      user: user.id,
      book: bookId,
    });

    if (deletedEntry) {
      return res.status(200).json({
        message: "Book removed from MyLibrary successfully",
        deletedEntry,
      });
    } else {
      return res.status(404).json({ message: "Book not found in MyLibrary" });
    }
  } catch (error) {
    console.error("Error removing book from MyLibrary:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// hàm này có cần không?
exports.findOne = async (req, res) => {
  const myLibrary = await MyLibrary.findOne(req.body);
  res.json({ myLibrary: myLibrary, statusCode: 200 });
};
