const factory = require("./FactoryHandler");

const ApiError = require("../Resuble/ApiErrors");
const { filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createGalleryModel = require("../Modules/createGallary");
const path = require("path");

exports.createGallery = factory.createOne(createGalleryModel);
exports.getGallerys = factory.getAll(createGalleryModel);
exports.getGallery = factory.getOne(createGalleryModel);
exports.updateGallery = factory.updateOne(createGalleryModel, "gallery");
exports.deleteGallery =
