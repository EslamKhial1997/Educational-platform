const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");
const expressAsyncHandler = require("express-async-handler");

exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter =  expressAsyncHandler(async (req, res, next) => {
    const deleteDoc = await createChaptersModel.findOneAndDelete(req.params.id);
    console.log(req.params.id);

    if (!deleteDoc) {
      return  next(
        new ApiError(
          `Sorry Can't Delete This ID :${req.params.id}`,
          404
        )
      );
     
    }
    // deleteDoc.remove();
    res.status(200).json({ message: "Delete Success", data: deleteDoc });
  });
