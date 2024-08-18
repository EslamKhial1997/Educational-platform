const factory = require("./FactoryHandler");
const createSectionModel = require("../Modules/createSection");
exports.createSections = factory.createOne(createSectionModel);
exports.getSections = factory.getAll(createSectionModel);
exports.getSection = factory.getOne(createSectionModel);
exports.updateSection = factory.updateOne(createSectionModel, "section");
exports.deleteSection = factory.deleteOne(createSectionModel, "section");
