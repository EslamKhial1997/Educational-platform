
const factory = require("./FactoryHandler");
const ApiError = require("../Resuble/ApiErrors");
const {  filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createHonorModel = require("../Modules/createHonor");

exports.createHonor = factory.createOne(createHonorModel);
exports.getHonors = factory.getAll(createHonorModel);
exports.getHonor = factory.getOne(createHonorModel);
exports.updateHonor = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createHonorModel.findByIdAndUpdate(
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
  updateDocById.save();
  res.status(200).json({ data: updateDocById });
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
