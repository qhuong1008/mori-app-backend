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
const postRouter = require("./route/post.route");
const azureStorageRouter = require("./azure/azure-storage.routes");
const { authenticateAllowedOrigins } = require("./auth/auth.middlewares");
const uploadImg = require("./controller/upload-file/upload-image.controller");
const cart = require("./route/cartItem.route");
const order = require("./route/order.route");
const payment = require("./route/payment.route");
const commentRouter = require("./route/comment.route");
const notificationRouter = require("./route/notification.route");
const followRouter = require("./route/follow.route");

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
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(authenticateAllowedOrigins);

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
app.use("/api/post", postRouter);
app.use("/api/cart", cart);
app.use("/api/order", order);
app.use("/api/order", payment);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/follow", followRouter);

app.get(`/api/accountimg/:imgName`, cors(), (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "accountimg", imgName);
  res.sendFile(imagePath);
});
app.get(`/api/bookimg/:imgName`, cors(), (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "bookimg", imgName);
  res.sendFile(imagePath);
});
app.get(`/api/bookepub/:imgName`, cors(), (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "bookepub", imgName);
  res.sendFile(imagePath);
});
app.get("/api/bookaudio/:book/:chapter/:imgName", (req, res) => {
  const book = req.params.book;
  const chapter = req.params.chapter;
  const imgName = req.params.imgName;
  const imagePath = path.join(
    __dirname,
    "data",
    "bookaudio",
    book,
    chapter,
    imgName
  );
  res.sendFile(imagePath);
});
app.get(`/api/postimg/:imgName`, cors(), (req, res) => {
  const imgName = req.params.imgName;
  const imagePath = path.join(__dirname, "data", "postimg", imgName);
  res.sendFile(imagePath);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});

module.exports = app;
