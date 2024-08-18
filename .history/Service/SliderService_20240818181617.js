const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createSliderModel = require("../Modules/createSlider");

exports.createSlider = factory.createOne(createSliderModel);
exports.getSliders = factory.getAll(createSliderModel);
exports.getSlider = factory.getOne(createSliderModel);
exports.updateSlider = factory.updateOne(createSliderModel, "slider");

exports.deleteSlider = factory.updateOne(createSliderModel, "slider");
