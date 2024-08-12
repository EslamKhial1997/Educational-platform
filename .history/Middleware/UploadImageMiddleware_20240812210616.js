const multer = require("multer");
const ApiError = require("../Resuble/ApiErrors");


const MulterOptions = () => {
  const storage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Image Allowed", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: multerFilter });
  return upload;
};
const MulterOptionsPDF = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/lecture'); // مكان حفظ الملفات
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  const upload = multer({ storage: storage, fileFilter: multerFilter });
  return upload;
};

exports.UploadSingleImage = (pdf) => MulterOptions().single(pdf);

exports.UploadSinglePDF = (ImageName) => MulterOptionsPDF().single(ImageName);
exports.UploadMultiImage = (ArrOfImage) => MulterOptions("data").fields(ArrOfImage);
