const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");
exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
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
