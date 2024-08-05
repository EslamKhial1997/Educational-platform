const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove, filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createSliderModel = require("../Modules/createSlider");


exports.createSlider = factory.createOne(createSliderModel);
exports.getSliders = factory.getAll(createSliderModel);
exports.getSlider = factory.getOne(createSliderModel);
exports.updateSlider = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createSliderModel.findById(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/slider/`;
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
    );

  if (updateDocById.image) {
    const relativePathimage = updateDocById.image.replace(baseUrl, "");
    filePathImage("slider", relativePathimage);
  }
  updateDocById.image = req.body.image;
  updateDocById.save();
  res.status(200).json({ data: updateDocById });
});

exports.deleteSlider = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createSliderModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/slider/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    filePathImage("Slider", relativePathimage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
