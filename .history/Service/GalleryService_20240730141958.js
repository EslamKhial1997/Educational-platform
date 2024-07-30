const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createGalleryModel = require("../Modules/createGallary");
exports.fsRemove = async (filePath) => {
  if (!filePath) return
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(" Faild Delete:", err);
    } else {
      console.log("Delete Is Success in local filesystem");
    }
  });
};
exports.createGallery = factory.createOne(createGalleryModel);
exports.getGallerys = factory.getAll(createGalleryModel);
exports.getGallery = factory.getOne(createGalleryModel);
exports.updateGallery =  expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await Model.findByIdAndUpdate(
    req.params.id,
    req.body.image === "" ? { $set: { name: req.body.name } } : req.body,

    { new: true }
  );

  if (!updateDocById)
    next(
      new ApiError(
        `Sorry Can't Update This ID From ID :${req.params.id}`,
        404
      )
    );
    if (updateDocById.image) {
      const relativePathimage = deleteDoc.image.replace(baseUrl, "");
      const filePathImage = path.join(
        __dirname,
        "../uploads/Gallery",
        relativePathimage
      );
      fsRemove(filePathImage);
    }
  updateDocById.save();
  res.status(200).json({ data: updateDocById });
});;



exports.deleteGallery = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createGalleryModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/Gallery/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    const filePathImage = path.join(
      __dirname,
      "../uploads/Gallery",
      relativePathimage
    );
    fsRemove(filePathImage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
