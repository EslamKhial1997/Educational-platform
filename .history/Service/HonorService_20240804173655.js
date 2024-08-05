// const factory = require("./FactoryHandler");
// const path = require("path");
// const ApiError = require("../Resuble/ApiErrors");
// const { fsRemove } = require("../Utils/imagesHandler");
// const expressAsyncHandler = require("express-async-handler");
// const createHonorModel = require("../Modules/createHonor");


// exports.createHonor = factory.createOne(createHonorModel);
// exports.getHonors = factory.getAll(createHonorModel);
// exports.getHonor = factory.getOne(createHonorModel);
// exports.updateHonor = factory.updateOne(createHonorModel);

// exports.deleteHonor = expressAsyncHandler(async (req, res, next) => {
//     const deleteDoc = await createHonorModel.findByIdAndDelete(req.params.id);
//     const baseUrl = `${process.env.BASE_URL}/Honor/`;
  
//     if (!deleteDoc) {
//       return next(
//         new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
//       );
//     }
//     if (deleteDoc.image) {
//       const relativePathimage = deleteDoc.image.replace(baseUrl, "");
//       const filePathImage = path.join(
//         __dirname,
//         "../uploads/Honor",
//         relativePathimage
//       );
//       fsRemove(filePathImage);
//     }
//     res.status(200).json({ message: "Delete Success", data: deleteDoc });
//   });
const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove, filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createHonorModel = require("../Modules/createHonor");


exports.createHonor = factory.createOne(createHonorModel);
exports.getHonors = factory.getAll(createHonorModel);
exports.getHonor = factory.getOne(createHonorModel);
exports.updateHonor = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createHonorModel.findById(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/Honor/`;
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
    );

  if (updateDocById.image) {
    const relativePathimage = updateDocById.image.replace(baseUrl, "");
    filePathImage("Honor", relativePathimage);
  }
  updateDocById.image = req.body.image;
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

