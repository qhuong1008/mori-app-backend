const Book = require("../model/book.model");
const Chapter = require("../model/chapter.model");

const express = require("express"),
  router = express.Router(),
  { BlobServiceClient } = require("@azure/storage-blob"),
  blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  ),
  multer = require("multer"),
  inMemoryStorage = multer.memoryStorage(),
  { BlockBlobClient } = require("@azure/storage-blob");

const getStream = require("into-stream");

const upload = multer({ storage: inMemoryStorage }).array("audio");

exports.uploadChapter = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const containerClient = blobServiceClient.getContainerClient(
        process.env.AZURE_STORAGE_CONTAINER_NAME_AUDIO
      );

      const book_id = req.body.book_id;

      // Kiểm tra xem book_id có tồn tại không
      const existingBook = await Book.findById(book_id);
      if (!existingBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      const bookName = existingBook.name;
      const bookDirectory = `${bookName}/`;

      const containerExists = await containerClient.exists();
      if (!containerExists) {
        await containerClient.create();
      }

      const uploadedFiles = req.files;

      for (const file of uploadedFiles) {
        const text = file.originalname;
        const matchResult = text.match(/-(.+)/);
        let fileAudioName = matchResult ? matchResult[1]?.trim() : text;
        fileAudioName = fileAudioName.replace(/\.mp3$/, '');

        const blobService = containerClient.getBlockBlobClient(
          `${bookDirectory}${text}`
        );

        const blobExists = await blobService.exists();
        if (!blobExists) {
          const stream = getStream(file.buffer);
          const streamLength = file.buffer.length;
          await blobService.uploadStream(stream, streamLength);
        }

        const newChapter = new Chapter({
          book_id: book_id,
          name: fileAudioName,
          audio: blobService.url,
        });

        const savedChapter = await newChapter.save();
        // Thêm chapter vào danh sách chapter của book
        existingBook.chapters.push(savedChapter._id);
        await existingBook.save();
      }

      res.status(200).json({
        message: "Chapters uploaded to Azure Blob storage.",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
