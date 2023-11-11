require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bookRouter = require("./route/book.route");
const accountRouter = require("./route/account.route");
const tagRouter = require("./route/tag.route");
const heartedRouter = require("./route/hearted.route");
const membershipRouter = require("./route/membership.route");
const membershipTypeRouter = require("./route/membershipType.route");
const readHistoryRouter = require("./route/readHistory.route");
const transactionRouter = require("./route/transaction.route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json({ extended: false }));
app.set("trust proxy", 1);

const databaseUrl =
  "mongodb+srv://moribook:Mori123456@cluster0.xdqbzc5.mongodb.net/moridb";

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
