
const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");


exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapter = factory.getOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);

