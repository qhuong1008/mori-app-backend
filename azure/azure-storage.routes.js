const express = require("express");
const router = express.Router();
const storageController = require("./azure-storage.controller");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("file");

router.get("/storage-img", storageController.getStorageBookImg);

router.get("/storage-pdf", storageController.getStorageBookPdf);

router.post(
  "/upload/book-img",
  uploadStrategy,
  storageController.uploadBookImg
);
router.post(
  "/upload/book-pdf",
  uploadStrategy,
  storageController.uploadBookPdf
);
router.post(
  "/upload/account-avatar",
  uploadStrategy,
  storageController.uploadAccountAvatar
);

module.exports = router;
