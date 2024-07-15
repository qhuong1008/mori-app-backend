exports.isValidImageFormat = (file) => {
  // Get the file extension
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  // Check if the file extension is in the supported image formats
  return [".jpg", ".jpeg", ".png"].includes(`.${fileExtension}`);
};
exports.isValidEpubFormat = (file) => {
  // Get the file extension
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  // Check if the file extension is in the supported image formats
  return [".epub"].includes(`.${fileExtension}`);
};

exports.isValidAudioFormat = (file) => {
  // Get the file extension
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  // Check if the file extension is in the supported image formats
  return [".m3u8"].includes(`.${fileExtension}`);
};
