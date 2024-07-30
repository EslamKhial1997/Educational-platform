const factory = require("./FactoryHandler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");


exports.createHonor = factory.createOne(createHonor);
exports.getHonors = factory.getAll(createHonorModel);
exports.getHonor = factory.getOne(createHonorModel);
exports.updateHonor = factory.updateOne(createHonorModel);

exports.deleteHonor = expressAsyncHandler(async (req, res, next) => {
    const deleteDoc = await createHonorModel.findByIdAndDelete(req.params.id);
    const baseUrl = `${process.env.BASE_URL}/Honor/`;
  
    if (!deleteDoc) {
      return next(
        new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
      );
    }
    if (deleteDoc.image) {
      const relativePathimage = deleteDoc.image.replace(baseUrl, "");
      const filePathImage = path.join(
        __dirname,
        "../uploads/Honor",
        relativePathimage
      );
      fsRemove(filePathImage);
    }
    res.status(200).json({ message: "Delete Success", data: deleteDoc });
  });
