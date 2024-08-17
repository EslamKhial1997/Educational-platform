const factory = require("./FactoryHandler");

const ApiError = require("../Resuble/ApiErrors");
const {  filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createGalleryModel = require("../Modules/createGallary");

exports.createGallery = factory.createOne(createGalleryModel);
exports.getGallerys = factory.getAll(createGalleryModel);
exports.getGallery = factory.getOne(createGalleryModel);
// exports.updateGallery = expressAsyncHandler(async (req, res, next) => {
//   const updateDocById = await createGalleryModel.findById(req.params.id);
//   const baseUrl = `${process.env.BASE_URL}/gallery/`;
//   if (!updateDocById)
//     next(
//       new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
//     );

//   if (updateDocById.image) {
//     const relativePathimage = updateDocById.image.replace(baseUrl, "");
//     filePathImage("gallery", relativePathimage);
//   }
//   updateDocById.image = req.body.image;
//   updateDocById.save();
//   res.status(200).json({ data: updateDocById });
// });

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
