const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const Account = require("../../model/account.model");
const express = require("express");
const router = express.Router();

// Cấu hình Multer để xử lý upload hình ảnh
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]; // Thêm các phần mở rộng khác nếu cần thiết
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(`.${fileExtension}`)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG or PNG images are allowed"), false);
    }
  },
});

// Kết nối tới Azure Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// checkAzureStorageConnection();

// Hàm để thay đổi ảnh cho tài khoản
router.post("/update-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const email = req.body.email;

    // Kiểm tra xem tài khoản có tồn tại không
    const account = await Account.findOne({ email: email });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Upload hình ảnh lên Azure Storage
    const username = account.displayName.replace(/[^\w\d\-._]/g, "");
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    const newFileName = `${username}.${fileExtension}`;

    const blockBlobClient = containerClient.getBlockBlobClient(newFileName);
    const file = req.file;

    // Kiểm tra xem tệp tin có tồn tại không
    if (!file) {
      res.status(400).send("No file uploaded");
      return;
    }

    await blockBlobClient.uploadData(file.buffer);
    // Lấy đường dẫn của hình ảnh trên Azure
    const avatarPath = blockBlobClient.url;

    // Cập nhật đường dẫn hình ảnh trong MongoDB
    account.avatar = avatarPath;
    await account.save();

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// hàm kiểm tra kết nối
async function checkAzureStorageConnection() {
  try {
    // Tên container bạn muốn kiểm tra
    const containerName = "accountimg";

    // Tạo đối tượng ContainerClient từ BlobServiceClient
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Kiểm tra sự tồn tại của container
    const exists = await containerClient.exists();

    if (exists) {
      console.log(
        `Connection to Azure Storage successful. Container "${containerName}" exists.`
      );
    } else {
      console.error(
        `Connection to Azure Storage failed. Container "${containerName}" does not exist.`
      );
    }
  } catch (error) {
    console.error("Error checking Azure Storage connection:", error);
  }
}

// Multer Configuration
const postImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/postimg/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = router;
