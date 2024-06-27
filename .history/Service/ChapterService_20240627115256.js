const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");

exports.createChapters = factory.createOne(createChaptersModel);
// exports.getChapters = factory.getAll(createChaptersModel);
getChapters
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);
