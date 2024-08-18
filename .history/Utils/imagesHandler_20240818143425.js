const expressAsyncHandler = require("express-async-handler");
const {
  UploadSingleImage,
  UploadSinglePDF,
} = require("../Middleware/UploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    const imageType = req.file?.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.file.buffer)
        .resize(1920, 1080)
        .toFormat(imageType)
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });
exports.resizeImageAuth = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    const imageType = req.file?.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.file.buffer)
        .resize(750, 750)
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingleImage("image");
exports.uploadPDF = UploadSinglePDF("pdf");
exports.fsRemove = async (filePath) => {
  if (!filePath) return new ApiError();
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(" Faild Delete:", err);
    } else {
      console.log("Delete Is Success in local filesystem");
    }
  });
};

exports.filePathImage = (fileName, relativePathimage) => {
  const filePath = path.join(
    __dirname,
    `../uploads/${fileName}/`,
    relativePathimage
  );
  this.fsRemove(filePath);
};
