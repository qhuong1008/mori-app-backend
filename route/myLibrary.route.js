const express = require("express");
const router = express.Router();
const cors = require("cors");
const myLibraryController = require("../controller/myLibrary.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.post("/add-book", myLibraryController.addBookToMyLibrary);
router.get(
  "/get-books/:id",
  isAuth,
  myLibraryController.getAllBooksInMyLibrary
);
router.get("/get-books", myLibraryController.findAll);
router.delete("/book", isAuth, myLibraryController.deleteBookFromMyLibrary);

module.exports = router;
