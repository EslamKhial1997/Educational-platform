const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");
const expressAsyncHandler = require("express-async-handler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
exports.createClasses = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassModel);
exports.getClass = factory.getOne(createClassModel);
exports.updateClass = factory.updateOne(createClassModel, "class");
exports.deleteClass = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createClassModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/class/`;
  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    const filePathImage = path.join(
      __dirname,
      "../uploads/class",
      relativePathimage
    );
    fsRemove(filePathImage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
