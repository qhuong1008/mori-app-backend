const express = require("express");
const router = express.Router();
const storageController = require("./azure-storage.controller");
const uploadAudioController = require("./upload-bookandchapter.controller");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("file");

router.get("/storage-img", storageController.getStorageBookImg);

router.get("/storage-pdf", storageController.getStorageBookPdf);
router.get("/storage-audio", storageController.getStorageBookAudio);
router.get("/storage-epub", storageController.getStorageBookEpub);

router.post(
  "/upload/book-img",
  uploadStrategy,
  storageController.uploadBookImg
);

router.post(
  "/upload/book-audio",
  uploadStrategy,
  storageController.uploadBookAudio
);
router.post(
  "/upload/book-pdf",
  uploadStrategy,
  storageController.uploadBookPdf
);
router.post(
  "/upload/book-epub",
  uploadStrategy,
  storageController.uploadBookEpub
);
router.post(
  "/upload/account-avatar",
  uploadStrategy,
  storageController.uploadAccountAvatar
);
router.post("/upload/chapter", uploadAudioController.uploadChapter);

module.exports = router;
