
const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");
exports.createClasses = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassModel);
exports.getClass = factory.getOne(createClassModel);
exports.deleteClass = 
    expressAsyncHandler(async (req, res, next) => {
      const deleteDoc = await Model.findByIdAndDelete(req.params.id);
      const baseUrl = `${process.env.BASE_URL}/teacher/`;
  
      if (!deleteDoc) {
        return next(
          new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
        );
      }
      if (deleteDoc.image) {
        const relativePathimage = deleteDoc.image.replace(baseUrl, "");
        const filePathImage = path.join(
          __dirname,
          "../uploads/teacher",
          relativePathimage
        );
        fsRemove(filePathImage);
      }
      if (deleteDoc.picture) {
        const relativePathPicture = deleteDoc.picture.replace(baseUrl, "");
        const filePathPicture = path.join(
          __dirname,
          "../uploads/teacher",
          relativePathPicture
        );
        fsRemove(filePathPicture);
      }
      if (deleteDoc.avater) {
        const relativePathAvatar = deleteDoc.avater.replace(baseUrl, "");
        const filePathAvater = path.join(
          __dirname,
          "../uploads/teacher",
          relativePathAvatar
        );
        fsRemove(filePathAvater);
      }
      res.status(200).json({ message: "Delete Success", data: deleteDoc });
    });


