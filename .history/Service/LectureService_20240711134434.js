
const factory = require("./FactoryHandler");

const createLecturesModel = require("../Modules/createAlecture");


exports.createLectures = factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);

