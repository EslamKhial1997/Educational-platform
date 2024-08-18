const factory = require("./FactoryHandler");

const createSectionModel = require("../Modules/createSection");
const expressAsyncHandler = require("express-async-handler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
exports.createSections = factory.createOne(createSectionModel);
exports.getSections = factory.getAll(createSectionModel);
exports.getSection = factory.getOne(createSectionModel);
exports.updateSection = factory.updateOne(createSectionModel , "section");
exports.deleteSection = factory.deleteOne(createSectionModel , "section");
