const express = require("express"),
  router = express.Router(),
  { BlobServiceClient } = require("@azure/storage-blob"),
  blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  ),
  multer = require("multer"),
  inMemoryStorage = multer.memoryStorage(),
  uploadStrategy = multer({ storage: inMemoryStorage }).single("image"),
  { BlockBlobClient } = require("@azure/storage-blob");

const getStream = require("into-stream");

exports.getStorageBookImg = async (req, res) => {
  let list = [];
  const blobs = blobServiceClient
    .getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME_IMG)
    .listBlobsFlat();
  for await (let blob of blobs) {
    list.push(blob.name);
  }
  return res.json({
    imgList: list,
  });
};
exports.getStorageBookPdf = async (req, res) => {
  let list = [];
  const blobs = blobServiceClient
    .getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME_PDF)
    .listBlobsFlat();
  for await (let blob of blobs) {
    list.push(blob.name);
  }
  return res.json({
    pdfList: list,
  });
};

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

exports.uploadBookImg = async (req, res) => {
  const blobName = getBlobName(req.file.originalname),
    blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      process.env.AZURE_STORAGE_CONTAINER_NAME_IMG,
      blobName
    ),
    stream = getStream(req.file.buffer),
    streamLength = req.file.buffer.length;
  blobService
    .uploadStream(stream, streamLength)
    .then((resp) => {
      res.json({
        blobUrl: blobService.url,
        message: "File uploaded to Azure Blob storage.",
      });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};
exports.uploadBookPdf = async (req, res) => {
  const blobName = getBlobName(req.file.originalname),
    blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      process.env.AZURE_STORAGE_CONTAINER_NAME_PDF,
      blobName
    ),
    stream = getStream(req.file.buffer),
    streamLength = req.file.buffer.length;
  blobService
    .uploadStream(stream, streamLength)
    .then(() => {
      // console.log("res:", res.json());
      res.json({
        blobUrl: blobService.url,
        message: "File uploaded to Azure Blob storage.",
      });
    })
    .catch((err) => {
      // console.log("err:", err);

      res.json({ err: err.message });
    });
};
exports.uploadAccountAvatar = async (req, res) => {
  const blobName = getBlobName(req.file.originalname),
    blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      process.env.AZURE_STORAGE_CONTAINER_NAME_AVATAR,
      blobName
    ),
    stream = getStream(req.file.buffer),
    streamLength = req.file.buffer.length;
  blobService
    .uploadStream(stream, streamLength)
    .then((res) => {
      res.json({
        blobUrl: blobService.url,
        message: "File uploaded to Azure Blob storage.",
      });
    })
    .catch((err) => {
      res.json({ err: err.message });
    });
};

exports.getStorageBookAudio = async (req, res) => {
  let list = [];
  const blobs = blobServiceClient
    .getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME_AUDIO)
    .listBlobsFlat();
  for await (let blob of blobs) {
    list.push(blob.name);
  }
  return res.json({
    audioList: list,
  });
};
exports.uploadBookAudio = async (req, res) => {
  const blobName = getBlobName(req.file.originalname),
    blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      process.env.AZURE_STORAGE_CONTAINER_NAME_AUDIO,
      blobName
    ),
    stream = getStream(req.file.buffer),
    streamLength = req.file.buffer.length;
  blobService
    .uploadStream(stream, streamLength)
    .then(() => {
      // console.log("res:", res.json());
      res.json({
        blobUrl: blobService.url,
        message: "File uploaded to Azure Blob storage.",
      });
    })
    .catch((err) => {
      // console.log("err:", err);

      res.json({ err: err.message });
    });
};
