require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
// const favicon = require("serve-favicon");
const logger = require("morgan");

const bookRouter = require("./route/book.route");
const accountRouter = require("./route/account.route");
const tagRouter = require("./route/tag.route");
const heartedRouter = require("./route/hearted.route");
const membershipRouter = require("./route/membership.route");
const membershipTypeRouter = require("./route/membershipType.route");
const readHistoryRouter = require("./route/readHistory.route");
const transactionRouter = require("./route/transaction.route");
const bookCategoryRouter = require("./route/bookCategory.route");
const ReviewRouter = require("./route/review.route");
const myLibraryRouter = require("./route/myLibrary.route");
const noteRouter = require("./route/note.route");
const replyRouter = require("./route/reply.route");
const bookRankingRouter = require("./route/bookRanking.route");
const chapterRouter = require("./route/chapter.route");
const authRouter = require("./auth/auth.routes");
const azureStorageRouter = require("./azure/azure-storage.routes");
const { authenticateAllowedOrigins } = require("./auth/auth.middlewares");
const uploadImg = require("./controller/upload-file/upload-image.controller");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json({ extended: false }));
app.set("trust proxy", 1);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(authenticateAllowedOrigins);

const databaseUrl = process.env.MONGODB_URL;

mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect Mongodb successfully"))
  .catch((err) => console.log("Error MongoDB: ", err));

app.use("/api/book", bookRouter);
app.use("/api/account", accountRouter);
app.use("/api/tag", tagRouter);
app.use("/api/hearted", heartedRouter);
app.use("/api/membership", membershipRouter);
app.use("/api/membershipType", membershipTypeRouter);
app.use("/api/readHistory", readHistoryRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/myLibrary", myLibraryRouter);
app.use("/api/bookCategory", bookCategoryRouter);
app.use("/api/review", ReviewRouter);
app.use("/api/membershipType", membershipTypeRouter);
app.use("/api/myLibrary", myLibraryRouter);
app.use("/api/note", noteRouter);
app.use("/api/reply", replyRouter);
app.use("/api/tag", tagRouter);
app.use("/api/bookRanking", bookRankingRouter);
app.use("/api/chapter", chapterRouter);

app.use("/api/account", uploadImg);

app.use("/api/azure", azureStorageRouter);
app.use("/api/bookRanking", bookRankingRouter);
app.use("/api/auth", authRouter);

//////////////////
const Account = require("./model/account.model");
const updateLink = async () => {
  try {
    // Lấy danh sách tất cả các sách
    const accounts = await Account.find({});
    console.log(accounts);

    // Lặp qua từng sách
    for (const account of accounts) {
      const newDomain = "http://103.130.211.150:10047/api";
      if (account.avatar) {
        // Thay đổi đường dẫn avatar
        account.avatar = account.avatar.replace(
          "http://103.130.211.150:10047",
          newDomain
        );
        // Lưu lại các thay đổi vào cơ sở dữ liệu
        await account.save();
      }
    }

    console.log("All LINK updated successfully");
  } catch (error) {
    console.error(`Error updating all LINK: ${error.message}`);
  }
};

updateLink();

const Book = require("./model/book.model");
const updateLinkBook = async () => {
  try {
    // Lấy danh sách tất cả các sách
    const books = await Book.find({});
    console.log(books);

    // Lặp qua từng sách
    for (const book of books) {
      const newDomain = "http://103.130.211.150:10047/api";
      if (book.image) {
        // Thay đổi đường dẫn avatar
        book.image = book.image.replace(
          "http://103.130.211.150:10047",
          newDomain
        );
        // Lưu lại các thay đổi vào cơ sở dữ liệu
        await book.save();
      }
    }

    console.log("All LINK updated successfully");
  } catch (error) {
    console.error(`Error updating all LINK: ${error.message}`);
  }
};

// updateLinkBook();

const Chapter = require("./model/chapter.model");
const updateLinkChapter = async () => {
  try {
    // Lấy danh sách tất cả các sách
    const books = await Chapter.find({});
    console.log(books);

    // Lặp qua từng sách
    for (const book of books) {
      const newDomain = "http://103.130.211.150:10047/api";
      if (book.audio) {
        // Thay đổi đường dẫn avatar
        book.audio = book.audio.replace(
          "http://103.130.211.150:10047",
          newDomain
        );
        // Lưu lại các thay đổi vào cơ sở dữ liệu
        await book.save();
      }
    }

    console.log("All LINK updated successfully");
  } catch (error) {
    console.error(`Error updating all LINK: ${error.message}`);
  }
};

// updateLinkChapter();

app.get(`/api/accountimg/:imgName`, (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "accountimg", imgName);
  res.sendFile(imagePath);
});
app.get(`/api/bookimg/:imgName`, (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "bookimg", imgName);
  res.sendFile(imagePath);
});
app.get(`/api/bookepub/:imgName`, (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "bookepub", imgName);
  res.sendFile(imagePath);
});
app.get(`/api/bookaudio/:imgName`, (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "bookaudio", imgName);
  res.sendFile(imagePath);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
