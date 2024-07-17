const expressAsyncHandler = require("express-async-handler");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    const imageType = req.file.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${imageType ? }`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingleImage("image");
exports.fsRemove = async (filePath) => {
  console.log(filePath);
    if (!filePath) return
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(" Faild Delete:", err);
      } else {
        console.log("Delete Is Success in local filesystem");
      }
    });
  };
