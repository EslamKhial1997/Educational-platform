
const factory = require("./FactoryHandler");
const ApiError = require("../Resuble/ApiErrors");
const {  filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createHonorModel = require("../Modules/createHonor");
exports.createHonor = factory.createOne(createHonorModel);
exports.getHonors = factory.getAll(createHonorModel);
exports.getHonor = factory.getOne(createHonorModel);
exports.updateHonor = expressAsyncHandler(async (req, res, next) => {
  try {
    const baseUrl = `${process.env.BASE_URL}/gallery/`;

    // العثور على الجاليري بناءً على ID
    const findGallery = await createHonorModel.findById(req.params.id);

    if (!findGallery) {
      return next(
        new ApiError(
          `Sorry, can't find the document with ID: ${req.params.id}`,
          404
        )
      );
    }

    // تحديث البيانات بناءً على ما إذا كانت الصورة فارغة
    const updateData =
      req.body.image === "" ? { teacher: req.body.teacher } : req.body;

    // تحديث المستند بناءً على ID
    const updateDocById = await createGalleryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updateDocById) {
      return next(
        new ApiError(
          `Sorry, can't update the document with ID: ${req.params.id}`,
          404
        )
      );
    }

    // التحقق مما إذا كانت الصورة القديمة مختلفة عن الصورة الجديدة
    if (
      findGallery.image &&
      req.body.image &&
      findGallery.image !== req.body.image
    ) {
      const relativePathImage = findGallery.image.split(baseUrl)[1];
      filePathImage("gallery", relativePathImage); // حذف الصورة القديمة
    }

    // تحديث مسار الصورة إذا تم توفيرها
    if (req.body.image) {
      updateDocById.image = req.body.image;
      await updateDocById.save();
    }

    res.status(200).json({ data: updateDocById });
  } catch (error) {
    next(error);
  }
});

exports.deleteHonor = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createHonorModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/honor/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    filePathImage("Honor", relativePathimage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
