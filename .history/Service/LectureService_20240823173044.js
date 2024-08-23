const factory = require("./FactoryHandler");

const createLecturesModel = require("../Modules/createAlecture");
const expressAsyncHandler = require("express-async-handler");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }

  next();
});
exports.createLectures = expressAsyncHandler(async (req, res) => {
  const createDoc = await createLecturesModel.create(req.body);
  res.status(201).json({ data: createDoc });
});

factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);
