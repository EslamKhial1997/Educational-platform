const expressAsyncHandler = require("express-async-handler");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    const imageType = req.file.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.file.buffer)
        .resize(1920, 1920)
        .toFormat(imageType)
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingleImage("image");

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // مكان حفظ الملفات
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// تحديد نوع الملفات المسموح بها (في هذه الحالة PDF فقط)
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

// إعداد multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
});

module.exports = upload;

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

exports.filePathImage = (fileName ,relativePathimage) => {
 const filePath = path.join(__dirname, `../uploads/${fileName}/`, relativePathimage);
  this.fsRemove(filePath)
};
