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
exports.deleteGallery = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createGalleryModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/gallery/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    filePathImage("gallery", relativePathimage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
