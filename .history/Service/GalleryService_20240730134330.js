const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createGalleryModel = require("../Modules/createGallary");

exports.createGallery = factory.createOne(createGalleryModel);
exports.getGallery = factory.getAll(createGalleryModel);
exports.getChapter = factory.getOne(createGalleryModel);
exports.updateChapter = factory.updateOne(createGalleryModel);

exports.deleteChapter = expressAsyncHandler(async (req, res, next) => {
    const deleteDoc = await createGalleryModel.findByIdAndDelete(req.params.id);
    const baseUrl = `${process.env.BASE_URL}/chapter/`;
  
    if (!deleteDoc) {
      return next(
        new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
      );
    }
    if (deleteDoc.image) {
      const relativePathimage = deleteDoc.image.replace(baseUrl, "");
      const filePathImage = path.join(
        __dirname,
        "../uploads/chapter",
        relativePathimage
      );
      fsRemove(filePathImage);
    }
    res.status(200).json({ message: "Delete Success", data: deleteDoc });
  });
