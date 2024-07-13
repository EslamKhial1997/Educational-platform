const factory = require("./FactoryHandler");

const createSectionModel = require("../Modules/createSection");
const expressAsyncHandler = require("express-async-handler");

exports.createSections = factory.createOne(createSectionModel);
exports.getSections = factory.getAll(createSectionModel);
exports.getSection = factory.getOne(createSectionModel);
exports.updateSection = factory.updateOne(createSectionModel);
exports.deleteSection = expressAsyncHandler(async (req, res, next) => {
    const deleteDoc = await createClassModel.findByIdAndDelete(req.params.id);
    const baseUrl = `${process.env.BASE_URL}/section/`;
  
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
  });;
