const Book = require("../model/book.model");
const Chapter = require("../model/chapter.model");
const { BlobServiceClient } = require("@azure/storage-blob"),
  blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  ),
  multer = require("multer"),
  inMemoryStorage = multer.memoryStorage();

const getStream = require("into-stream");
const upload = multer({ storage: inMemoryStorage }).array("audio");

exports.uploadChapter = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "error", message: err.message });
      }

      // container name lưu ở bookaudio
      const containerClient = blobServiceClient.getContainerClient(
        process.env.AZURE_STORAGE_CONTAINER_NAME_AUDIO
      );

      const book_id = req.body.book_id;
      // Kiểm tra xem book_id có tồn tại không
      const existingBook = await Book.findById(book_id);
      if (!existingBook) {
        return res
          .status(400)
          .json({ error: "error", message: "Book not found" });
      }

      // Tạo thư mục là tên của cuốn sách đó
      const bookName = existingBook.name;
      const bookDirectory = `${bookName}/`;

      // Kiểm tra thư mục này có chưa
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        await containerClient.create();
      }

      // load file
      const uploadedFiles = req.files;

      for (const file of uploadedFiles) {
        // lấy tên của chapter đẩy lên (mặc định là tên đúng với chapter đó, để lấy nó làm tên chapter luôn)
        // tên file ví dụ kiểu: Đừng lựa chọn an nhàn khi còn trẻ - Chương 1 - Tài năng khổ luyện mà thành mới là đạo lí đích thực
        const text = file.originalname;
        const prefix = existingBook.name + " -"; // cắt theo "tên sách -" vì để tên file tải lên mặc định là tên sách - tên chương
        let fileAudioName;
        if (text.startsWith(prefix)) {
          fileAudioName = text.substring(prefix.length).trim();
        } else {
          fileAudioName = text;
        }

        // tạo file vào đúng đường dẫn của thư mục book vừa rồi
        const blobService = containerClient.getBlockBlobClient(
          `${bookDirectory}${text}`
        );

        // Kiểm tra cái file đã được tải lên trước đó chưa
        const blobExists = await blobService.exists();
        if (!blobExists) {
          const stream = getStream(file.buffer);
          const streamLength = file.buffer.length;
          await blobService.uploadStream(stream, streamLength);
        }

        // Kiểm tra trong db có chapter nào tên giống chapter này k, có thì trả về lỗi
        const existingChapter = await Chapter.findOne({ name: fileAudioName });
        if (existingChapter) {
          return res.status(400).json({
            error: "error",
            message: `Chapter ${fileAudioName} with this name already exists.`,
          });
        }

        // Thêm chapter vào db
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
    res.status(500).json({ error: "error", message: error.message });
  }
};
