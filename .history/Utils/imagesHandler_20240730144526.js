const expressAsyncHandler = require("express-async-handler");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    const imageType = req.file.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.file.buffer)
        .resize(500, 750)
        .toFormat(imageType)
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingleImage("image");
exports.fsRemove = async (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(" Faild Delete:", err);
    } else {
      console.log("Delete Is Success in local filesystem");
    }
  });
};

const filePathImage = () => {
 const filePath = path.join(__dirname, `../uploads/gallery/`, relativePathimage);
  fsRemove(filePath)
};
