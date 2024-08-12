const factory = require("./FactoryHandler");

const createLecturesModel = require("../Modules/createAlecture");
const expressAsyncHandler = require("express-async-handler");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
   

    const pdfname = `image-${uuidv4()}-${Date.now()}-${req.file.filename}}`;

    req.body.image = pdfname;
  }

  next();
});
exports.createLectures = factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);
