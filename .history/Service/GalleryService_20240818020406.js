const factory = require("./FactoryHandler");

const ApiError = require("../Resuble/ApiErrors");
const { filePathImage, fsRemove } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createGalleryModel = require("../Modules/createGallary");
const path = require("path");

exports.createGallery = factory.createOne(createGalleryModel);
exports.getGallerys = factory.getAll(createGalleryModel);
exports.getGallery = factory.getOne(createGalleryModel);
exports.updateGallery = expressAsyncHandler(async (req, res, next) => {
  try {
    // تحديد البيانات التي سيتم تحديثها بناءً على وجود صورة في الطلب
    const updateData = req.body.image === "" 
      ? { teacher: req.body.teacher } 
      : req.body;

    // تحديث المستند بناءً على ID
    const updateDocById = await createGalleryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateDocById) {
      return next(
        new ApiError(`Sorry, can't update the document with ID: ${req.params.id}`, 404)
      );
    }

    const baseUrl = `${process.env.BASE_URL}/gallery/`;

    // إذا كان هناك صورة جديدة مختلفة عن الصورة الحالية، قم بحذف الصورة القديمة
    if (updateDocById.image && req.body.image && updateDocById.image !== req.body.image) {
      const relativePathOldImage = updateDocById.image.replace(baseUrl, "");
      filePathImage("gallery", relativePathOldImage);

      // تحديث مسار الصورة الجديدة
      updateDocById.image = req.body.image;
      await updateDocById.save();
    }

    res.status(200).json({ data: updateDocById });

  } catch (error) {
    next(error);
  }
});




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
